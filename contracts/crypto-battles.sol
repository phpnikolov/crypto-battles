pragma solidity ^0.4.20;

contract Ownable {
    address private owner;

    function Ownable() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

contract Random {

    uint private seed ;
    
    function generateSeed() internal returns (uint) {
        seed = uint256(keccak256(
            seed,
            block.blockhash(block.number - 1),
            block.coinbase,
            block.difficulty
        ));
    return seed;
  }


  function random(uint _seed, uint _min, uint _max) internal pure returns (uint) {
      require(_min < _max);

    uint r = _seed % (_max - _min + 1);
    return _min + r;
  }
  
}


contract CryptoBattles is Ownable, Random {
    
    enum CreatureType {
        unknown,
        Halfling,
        Rogue,
        Nomad
    }
    
    enum CreatureCount {
        unknown,
        Few, 	// 1–4
        Several,// 5–9
        Pack,	// 10–19
        Lots,	// 20–49
        Horde	// 50–99
    }
    
    struct Creature {
        uint damageMin;
        uint damageMax;
        uint health;
        uint diamondsMin;
        uint diamondsMax;
        uint experience;
    }
    
    struct Player {
        bytes12 username;
        uint registrationBlock;
        uint lastSynced; // block number
        uint diamonds;
        uint experience;
        uint health;
        
        uint strengthPoints;
        uint vitalityPoints;
        uint intelligencePoints;
        
        // when was killed idx => day
        mapping (uint8 => uint) killedCreatures;
    }

    // all registered players
    mapping (address => Player) private players;
    
    // all creatures
    mapping (uint8 => Creature) private creatures;
    
    function CryptoBattles() public {
        // Halfling (10)
        creatures[uint8(CreatureType.Halfling)] = Creature({
            damageMin: 1,
            damageMax: 3,
            health: 4,
            diamondsMin: 8,
            diamondsMax: 12,
            experience: 30
        });
        
        // Rogue (15)
        creatures[uint8(CreatureType.Rogue)] = Creature({
            damageMin: 2,
            damageMax: 4,
            health: 6,
            diamondsMin: 15,
            diamondsMax: 25,
            experience: 40
        });
        
        // Nomad (23)
        creatures[uint8(CreatureType.Nomad)] = Creature({
            damageMin: 2,
            damageMax: 6,
            health: 11,
            diamondsMin: 20,
            diamondsMax: 24,
            experience: 80
        });
    }
    
    modifier isPlayer() {
        require(isRegistered(msg.sender) == true);
        _;
    }
  
    function isRegistered(address _addr) public view returns(bool) {
        return players[_addr].lastSynced > 0;
    } 

    function register(bytes12 _username) public {
        require(isRegistered(msg.sender) == false);
        require(_username.length >= 4);

        players[msg.sender] = Player({
            username: _username,
            registrationBlock: block.number,
            lastSynced: block.number,
            diamonds: random(generateSeed(), 900, 1100),
            experience: 0,
            health : 100,
            
            strengthPoints:0,
            vitalityPoints:0,
            intelligencePoints:0
            
        });
    }
    
    function getDay(address _addr) private view returns(uint) {
        return 1 + (block.number - players[_addr].registrationBlock) / 1000;
    }
    
    // How many experience is needed for a certain level http://www.wolframalpha.com/input/?i=40*(x+-+1)(x+%2B+8);+x+from+1+to+99
    function getLevelSize(uint _level) private pure returns(uint) {
        require(_level > 0);
        return (40 * (_level - 1) * (_level + 8));
    }
    
    function getLevel(address _addr) private view returns(uint) {

        for (uint i = 0; i < 99; i++) {
            if (players[_addr].experience < getLevelSize(i + 1)) {
                return i;
            }
        }
        return 99;
    }
    
    function getUnsyncedBlocks(address _addr) private view returns(uint) {
        return block.number - players[_addr].lastSynced;
    }
    
    function syncPlayer(address _addr) private {
        players[_addr].health = getHealth(_addr);
        players[_addr].lastSynced = block.number;
    }
    
    function getStrength(address _addr) private view returns(uint) {
        return 35 + players[_addr].strengthPoints;
    }
    
    function getVitaility(address _addr) private view returns(uint) {
        return 20 + players[_addr].vitalityPoints;
    }
    
    function getIntelligence(address _addr) private view returns(uint) {
        return 20 + players[_addr].intelligencePoints;
    }
    
    function getHealthPerBlock(address _addr) private view returns(uint) {
        return (1 * getIntelligence(_addr));
    }
    
    function getMaxHealth(address _addr) private view returns(uint) {
        return getVitaility(_addr) * 5;
    }
    
    function getHealth(address _addr) private view returns(uint) {
        uint notSyncedHealth = getUnsyncedBlocks(_addr) * getHealthPerBlock(_addr);
        
        if (players[_addr].health + notSyncedHealth > getMaxHealth(_addr)) {
            return getMaxHealth(_addr);
        }
        
        return  players[_addr].health + notSyncedHealth;
    }
    
    function getDamage(address _addr) private view returns(uint) {
        return getStrength(_addr) * 1;
    }
    
    // convert CreatureCount to random value in specified intervals
    function getCreaturesCount(CreatureCount cc) private returns(uint) {
        if (cc == CreatureCount.Few) {
            return random(generateSeed(), 1, 4);
        }
        
        if (cc == CreatureCount.Several) {
            return random(generateSeed(), 5, 9);
        }
        
        if (cc == CreatureCount.Pack) {
            return random(generateSeed(), 10, 19);
        }
        
        if (cc == CreatureCount.Lots) {
            return random(generateSeed(), 20, 49);
        }
        
        if (cc == CreatureCount.Horde) {
            return random(generateSeed(), 50, 99);
        }
        
        return 0;
    }
    
    
    // pseudo random Creature which is unique for the day (1000 blocks)
    // CreatureType = _creatureCode % 100;
    // CreatureCount =  (_creatureCode - CreatureType) / 100
    function getCreature(address _addr, uint8 _creatureIdx) private view returns(uint _creatureCode){
        require(_creatureIdx < 6);
        
        uint lvl = getLevel(_addr);
        
        uint staticSeed1 = uint256(keccak256(_creatureIdx, getDay(_addr), _addr));
        uint rand1 = random(staticSeed1, 0, 99);
        
        CreatureType creature;
        CreatureCount count;

        if (lvl <= 5) {
            /* <= Level 5
             * Halfling - Several (25%)
             * Halfling - Few (15%)
             * Halfling - Pack (10%)
             * Rogue - Few (20%)
             * Rogue - Several (20%)
             * Nomad - Few (10%)
             */
            if (rand1 < 25) {
                creature = CreatureType.Halfling;
                count = CreatureCount.Several;
            }
            else if (rand1 < 40) {
                creature = CreatureType.Halfling;
                count = CreatureCount.Few;
            }
            else if (rand1 < 50) {
                creature = CreatureType.Halfling;
                count = CreatureCount.Pack;
            }
            else if (rand1 < 70) {
                creature = CreatureType.Rogue;
                count = CreatureCount.Few;
            }
            else if (rand1 < 90) {
                creature = CreatureType.Rogue;
                count = CreatureCount.Several;
            }
            else {
                creature = CreatureType.Rogue;
                count = CreatureCount.Several;
            }
        }
        
        _creatureCode = (uint(count) * 100) + uint(creature);
    }
    
    
    // return all avaiable creatures (codes)
    function getCreatures() isPlayer public view returns(
        uint _creatureCode0,
        uint _creatureCode1,
        uint _creatureCode2,
        uint _creatureCode3,
        uint _creatureCode4,
        uint _creatureCode5
    ){
        address _addr = msg.sender;
       _creatureCode0 = players[_addr].killedCreatures[0] < getDay(_addr) ? getCreature(_addr, 0) : 0;
       _creatureCode1 = players[_addr].killedCreatures[1] < getDay(_addr) ? getCreature(_addr, 1) : 0;
       _creatureCode2 = players[_addr].killedCreatures[2] < getDay(_addr) ? getCreature(_addr, 2) : 0;
       _creatureCode3 = players[_addr].killedCreatures[3] < getDay(_addr) ? getCreature(_addr, 3) : 0;
       _creatureCode4 = players[_addr].killedCreatures[4] < getDay(_addr) ? getCreature(_addr, 4) : 0;
       _creatureCode5 = players[_addr].killedCreatures[5] < getDay(_addr) ? getCreature(_addr, 5) : 0;
    }
    
    function fightCreature(uint8 _creatureIdx) isPlayer public returns(
        uint _units,
        uint _diamondsWon,
        uint _experienceWon
        ){
        address _addr = msg.sender;
         
        // acepted creatures 0-6
        require(_creatureIdx < 6);
        
        // check if this creature is killed today
        require(players[_addr].killedCreatures[_creatureIdx] < getDay(_addr));
        
        syncPlayer(_addr);
        
       
        uint creatureCode = getCreature(_addr, _creatureIdx);
        uint8 cType = uint8(creatureCode % 100);
        CreatureCount cCount = CreatureCount((creatureCode - cType) / 100); // enum value (several, few...)
        
        Creature memory creature = creatures[cType];
        
        _units = getCreaturesCount(cCount);
        uint _totalHealth = creature.health * _units;
        uint _totalDamage = random(generateSeed(), creature.damageMin, creature.damageMax) * _units;
        //dummy code
        uint _healthLost = 20;
        
        // won
        if (players[_addr].health > _healthLost) {
            _diamondsWon = random(generateSeed(), creature.diamondsMin, creature.diamondsMax) * _units;
            _experienceWon = creature.experience * _units;
            
            players[_addr].health -= _healthLost;
            players[_addr].diamonds += _diamondsWon;
            players[_addr].experience += _experienceWon;
            
            // mark creature as dead
            players[_addr].killedCreatures[_creatureIdx] = getDay(_addr);
        }
        else {
            // ban player to play until next day
            players[_addr].health = 0;
            _diamondsWon = 0;
            _experienceWon = 0;
            
        }

    }
    
    function getPlayer() isPlayer public view returns(
        bytes12 _username,
        uint _day,
        uint _diamonds,
        uint _experience,
        uint _strength,
        uint _vitaility,
        uint _intelligence,
        uint _health
    ){
        address _addr = msg.sender;
        _username = players[_addr].username;
        _day = getDay(_addr);
        _diamonds = players[_addr].diamonds;
        _experience = players[_addr].experience;
        _strength = getStrength(_addr);
        _vitaility = getVitaility(_addr);
        _intelligence = getIntelligence(_addr);
        _health = getHealth(_addr);
    }
}