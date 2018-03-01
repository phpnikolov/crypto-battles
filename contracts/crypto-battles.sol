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

    uint private lastRandom ;
    
    function random() internal returns (uint) {
        lastRandom = uint256(keccak256(
            lastRandom,
            block.blockhash(block.number - 1),
            block.coinbase,
            block.difficulty
        ));
    return lastRandom;
  }


  function rangedRandom(uint _random, uint _min, uint _max) internal pure returns (uint) {
      require(_min < _max);

    uint r = _random % (_max - _min + 1);
    return _min + r;
  }
  
}


contract CryptoBattles is Ownable, Random {
    
    enum CreatureType {
        dead,
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
        uint damage;
        uint health;
        uint gold;
        uint experience;
    }
    
    struct Player {
        bytes12 username;
        uint registrationBlock;
        uint lastSynced; // block number
        uint level;
        uint gold;
        uint experience;
        uint health;
        
        uint strengthPoints;
        uint vitalityPoints;
        uint intelligencePoints;
        
        // when was killed idx => day
        mapping (uint8 => uint) killedCreatures;
        
        uint deadUntil; // block number
    }

    // all registered players
    mapping (address => Player) private players;
    
    // all creatures
    mapping (uint8 => Creature) private creatures;
    
    function CryptoBattles() public {
        // base formula
        // gold = (damage + health) * 2
        // experience = (damage + health) * 5
        
        // Halfling
        creatures[uint8(CreatureType.Halfling)] = Creature({
            damage: 3,
            health: 5,
            gold: 16, // 8 * 2
            experience: 40 // 8 * 5
        });
        
        // Rogue
        creatures[uint8(CreatureType.Rogue)] = Creature({
            damage: 7,
            health: 5,
            gold: 36, // 12 * 3 (50% more gold)
            experience: 40 // 12 * 3.3 (50% less exp)
        });
        
        // Nomad
        creatures[uint8(CreatureType.Nomad)] = Creature({
            damage: 8,
            health: 16,
            gold: 32, // 24 * 1.3 (50% less gold)
            experience: 180 // 24 * 7.5 (50% more exp)
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

        players[msg.sender] = Player({
            username: _username,
            registrationBlock: block.number,
            lastSynced: block.number,
            level: 1,
            gold: 1000,
            experience: 0,
            health : 100,
            
            strengthPoints:0,
            vitalityPoints:0,
            intelligencePoints:0,
            deadUntil: 0
        });
    }
    
    // day length 2400 blocks (~10 hours)
    function getDay(address _addr) private view returns(uint) {
        return 1 + (block.number - players[_addr].registrationBlock) / 2400;
    }
    
    function isDead(address _addr) private view returns(bool) {
        return players[_addr].deadUntil > block.number;
    }
    
    // How many experience is needed for a certain level http://www.wolframalpha.com/input/?i=40*(x+-+1)(x+%2B+8);+x+from+1+to+99
    function getLevelSize(uint _level) private pure returns(uint) {
        return (40 * (_level - 1) * (_level + 8));
    }
    
    function syncLevel(address _addr) private {
        while (players[_addr].experience > getLevelSize(players[_addr].level + 1)) {
            players[_addr].level++;
        }
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
    
    function getHealthPer100Block(address _addr) private view returns(uint) {
        // 1 intelligence = 0.1 health per block (10 health per 100block)
        
        return (10 * getIntelligence(_addr));
    }
    
    function getMaxHealth(address _addr) private view returns(uint) {
        return getVitaility(_addr) * 5;
    }
    
    function getHealth(address _addr) private view returns(uint) {
        if (isDead(_addr)) {
            return 0;
        }
        uint notSyncedBlocks = (block.number - players[_addr].lastSynced);
        uint notSyncedHealth =  notSyncedBlocks * getHealthPer100Block(_addr) / 100;
        
        if (players[_addr].health + notSyncedHealth > getMaxHealth(_addr)) {
            return getMaxHealth(_addr);
        }
        
        return players[_addr].health + notSyncedHealth;
    }
    
    function getDamage(address _addr) private view returns(uint) {
        return getStrength(_addr);
    }

    function creatureCount2Number(CreatureCount _creatureCount) private returns(uint) {
        if (_creatureCount == CreatureCount.Few) {
            return rangedRandom(random(), 1, 4);
        }
        
        if (_creatureCount == CreatureCount.Several) {
            return rangedRandom(random(), 5, 9);
        }
        
        if (_creatureCount == CreatureCount.Pack) {
            return rangedRandom(random(), 10, 19);
        }
        
        if (_creatureCount == CreatureCount.Lots) {
            return rangedRandom(random(), 20, 49);
        }
        
        if (_creatureCount == CreatureCount.Horde) {
            return rangedRandom(random(), 50, 99);
        }
        
        return 0;
    }
    

    function getCreature(address _addr, uint day, uint8 _creatureIdx) private view returns(CreatureType _type, CreatureCount _count){
        require(_creatureIdx < 6);
        
        if ( players[_addr].killedCreatures[_creatureIdx] >= day) {
            _type = CreatureType.dead; // this creature is dead
            _count = CreatureCount.unknown;
            return;
        }

        uint staticRand = uint256(keccak256(_creatureIdx, day, _addr));
        uint rand = rangedRandom(staticRand, 0, 99);

        if (players[_addr].level <= 5) {
            /* <= Level 5
             * Halfling - Several (30%)
             * Rogue - Several (30%)
             * Nomad - Few (30%)
             * Halfling - Pack (10%)
             */
            if (rand < 30) {
                _type = CreatureType.Halfling;
                _count = CreatureCount.Several;
            }
            else if (rand < 60) {
                _type = CreatureType.Rogue;
                _count = CreatureCount.Several;
            }
            else if (rand < 90) {
                _type = CreatureType.Halfling;
                _count = CreatureCount.Few;
            }
            else {
                _type = CreatureType.Halfling;
                _count = CreatureCount.Pack;
            }
        }
    }
    
    
    // return all avaiable creatures (codes)
    function getCreatures() isPlayer public view returns(
        CreatureType _cType0,
        CreatureCount _cCount0,
        CreatureType _cType1,
        CreatureCount _cCount1,
        CreatureType _cType2,
        CreatureCount _cCount2,
        CreatureType _cType3,
        CreatureCount _cCount3,
        CreatureType _cType4,
        CreatureCount _cCount4,
        CreatureType _cType5,
        CreatureCount _cCount5
    ){
        uint today = getDay(msg.sender);
        
       (_cType0, _cCount0) = getCreature(msg.sender, today, 0);
       (_cType1, _cCount1) = getCreature(msg.sender, today, 1);
       (_cType2, _cCount2) = getCreature(msg.sender, today, 2);
       (_cType3, _cCount3) = getCreature(msg.sender, today, 3);
       (_cType4, _cCount4) = getCreature(msg.sender, today, 4);
       (_cType5, _cCount5) = getCreature(msg.sender, today, 5);
    }
    
    function fightCreature(uint8 _creatureIdx) isPlayer public returns(
        CreatureType _cType,
        uint _units,
        uint _healthLost,
        uint _goldWon,
        uint _experienceWon
        ){
        require(!isDead(msg.sender));
        
        // acepted creatures 0-6
        require(_creatureIdx < 6);
        
  
        uint today = getDay(msg.sender);
        
        CreatureCount cCount;
        
        (_cType, cCount) = getCreature(msg.sender, today, _creatureIdx);
        require(_cType != CreatureType.dead);

        Creature memory creature = creatures[uint8(_cType)];
        
        _units = creatureCount2Number(cCount);
        
        uint playerHealth = getHealth(msg.sender);
        
        // creature health * units = total crreatures health
        // multiply by 10000 for better decimal calculations, then devide by 10000;
        // total crreatures health / player damage = how many attacks is needed to kill the creatures
        // attakcs needed * creature damage = how many health player will lost
        _healthLost = creature.health * _units * 10000 / getDamage(msg.sender) * creature.damage * _units / 10000; 
        
        // won
        if (playerHealth > _healthLost) {
            _goldWon = creature.gold * _units;
            _experienceWon = creature.experience * _units;
            
            players[msg.sender].health = playerHealth - _healthLost;
            
            players[msg.sender].gold += _goldWon;
            players[msg.sender].experience += _experienceWon;
            
            syncLevel(msg.sender); // update users level after experience gain
            
            // mark creature as dead
            players[msg.sender].killedCreatures[_creatureIdx] = today;
        }
        else {
             // players is dead for 1000 blocks (~4 h)
            players[msg.sender].deadUntil = block.number + 1000;
            players[msg.sender].health = getMaxHealth(msg.sender);
        }
        
        players[msg.sender].lastSynced = block.number;
    }
    
    function getPlayer() isPlayer public view returns(
        bytes12 _username,
        uint _level,
        uint _day,
        uint _gold,
        uint _experience,
        uint _strength,
        uint _vitaility,
        uint _intelligence,
        uint _health,
        uint _deadUntil
    ){
        address _addr = msg.sender;
        _username = players[_addr].username;
        _level = players[_addr].level;
        _day = getDay(_addr);
        _gold = players[_addr].gold;
        _experience = players[_addr].experience;
        _strength = getStrength(_addr);
        _vitaility = getVitaility(_addr);
        _intelligence = getIntelligence(_addr);
        _health = getHealth(_addr);
        _deadUntil = players[_addr].deadUntil;
    }
}