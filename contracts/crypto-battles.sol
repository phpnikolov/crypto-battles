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
        unknown,
        Halfling,
        Rogue,
        Pikeman,
        Nomad,
        Swordman,
        Cavalier
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
    
    struct Battle {
        CreatureType cType;
        uint units;
        uint day;
    }
    
    struct Player {
        bytes12 username;
        uint registrationBlock;
        uint lastSynced; // block number
        uint level;
        uint gold;
        uint experience;
        uint health;
        
        uint damagePoints;
        uint healthPoints;
        uint regenerationPoints;
        
        // creature index => last battle
        mapping (uint8 => Battle) lastBattles;
        
        uint deadOn; // day
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
        
        // Pikeman
        creatures[uint8(CreatureType.Pikeman)] = Creature({
            damage: 7,
            health: 9,
            gold: 32, // 16 * 2
            experience: 60 // 12 * 5
        });
        
        // Nomad
        creatures[uint8(CreatureType.Nomad)] = Creature({
            damage: 8,
            health: 16,
            gold: 32, // 24 * 1.3 (50% less gold)
            experience: 180 // 24 * 7.5 (50% more exp)
        });
        
        // Swordman
        creatures[uint8(CreatureType.Swordman)] = Creature({
            damage: 15,
            health: 21,
            gold: 72, // 36 * 2
            experience: 180 // 36 * 5
        });
        
        // Cavalier
        creatures[uint8(CreatureType.Cavalier)] = Creature({
            damage: 20,
            health: 40,
            gold: 80, // 60 * 1.3 (50% less gold)
            experience: 450 // 60 * 7.5 (50% more exp)
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
            
            damagePoints:0,
            healthPoints:0,
            regenerationPoints:0,
            deadOn: 0
        });
    }
    
    // day length 1000 blocks (~4 hours)
    function getDay(address _addr) private view returns(uint) {
        return 1 + (block.number - players[_addr].registrationBlock) / 1000;
    }
    
    function isDead(address _addr) private view returns(bool) {
        return players[_addr].deadOn == getDay(_addr);
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
    
    
    function getHealthPer100Block(address _addr) private view returns(uint) {
        // 1 spirit = 0.1 health per block (10 health per 100block)
        
        return 100 + (players[_addr].regenerationPoints) * 10;
    }
    
    function getMaxHealth(address _addr) private view returns(uint) {
        return 100 + (players[_addr].healthPoints) * 5;
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
        return 35 + (players[_addr].damagePoints) * 1;
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
    
    
    function getBattles() public view returns(
        CreatureType _cType0,
        uint _uinits0,
        CreatureType _cType1,
        uint _uinits1,
        CreatureType _cType2,
        uint _uinits2,
        CreatureType _cType3,
        uint _uinits3,
        CreatureType _cType4,
        uint _uinits4
    ) {
        address _addr = msg.sender;
        uint day = getDay(_addr);
        mapping (uint8 => Battle) battles = players[_addr].lastBattles;
        
        if (players[_addr].lastBattles[0].day == day) {
            _cType0 = battles[0].cType;
            _uinits0 = battles[0].units;
        }
        
        if (battles[1].day == day) {
            _cType1 = battles[1].cType;
            _uinits1 = battles[1].units;
        }
        
        if (battles[2].day == day) {
            _cType2 = battles[2].cType;
            _uinits2 = battles[2].units;
        }
        
        if (battles[3].day == day) {
            _cType3 = battles[3].cType;
            _uinits3 = battles[3].units;
        }
        
        if (battles[4].day == day) {
            _cType4 = battles[4].cType;
            _uinits4 = battles[4].units;
        }
    }
    
    

    function getCreature(address _addr, uint day, uint8 _creatureIdx) private view returns(CreatureType _type, CreatureCount _count){
        require(_creatureIdx < 5);
        
        // this random will return same number for current day (1000 blocks)
        uint staticRand = uint256(keccak256(_creatureIdx, day, _addr));
        uint rand = rangedRandom(staticRand, 0, 99);

        if (players[_addr].level <= 5) {
            /* Level 1-5
             * Halfling - Several (25%)
             * Rogue - Several (25%)
             * Pikeman - Few (25%)
             * Nomad - Few (25%)
             */
            if (rand < 25) {
                _type = CreatureType.Halfling;
                _count = CreatureCount.Several;
            }
            else if (rand < 50) {
                _type = CreatureType.Rogue;
                _count = CreatureCount.Several;
            }
            else if (rand < 75) {
                _type = CreatureType.Pikeman;
                _count = CreatureCount.Few;
            }
            else {
                _type = CreatureType.Nomad;
                _count = CreatureCount.Few;
            }
        }
        else if (players[_addr].level <= 10) {
            /* Level 5-10
             * Halfling - Pack (20%)
             * Rogue - Pack (20%)
             * Pikeman - Pack (20%)
             * Nomad - Several (20%)
             * Swordman - Few (20%)
             */
            if (rand < 20) {
                _type = CreatureType.Halfling;
                _count = CreatureCount.Pack;
            }
            else if (rand < 40) {
                _type = CreatureType.Rogue;
                _count = CreatureCount.Pack;
            }
            else if (rand < 60) {
                _type = CreatureType.Pikeman;
                _count = CreatureCount.Pack;
            }
            else if (rand < 80) {
                _type = CreatureType.Nomad;
                _count = CreatureCount.Several;
            }
             else {
                _type = CreatureType.Swordman;
                _count = CreatureCount.Few;
            }
        }
    }
    
    
    // return daily creatures
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
        CreatureCount _cCount4
    ){
        uint today = getDay(msg.sender);
        
       (_cType0, _cCount0) = getCreature(msg.sender, today, 0);
       (_cType1, _cCount1) = getCreature(msg.sender, today, 1);
       (_cType2, _cCount2) = getCreature(msg.sender, today, 2);
       (_cType3, _cCount3) = getCreature(msg.sender, today, 3);
       (_cType4, _cCount4) = getCreature(msg.sender, today, 4);
    }
    
    function attackCreature(uint8 _creatureIdx) isPlayer public {
        require(!isDead(msg.sender));
        
        // acepted creatures 0-6
        require(_creatureIdx < 6);
        
        uint today = getDay(msg.sender);
        
        // check if this creature is attacked today
        require(players[msg.sender].lastBattles[_creatureIdx].day < today);
  
        CreatureType cType;
        CreatureCount cCount;
        
        (cType, cCount) = getCreature(msg.sender, today, _creatureIdx);

        Creature memory creature = creatures[uint8(cType)];
        
        uint units = creatureCount2Number(cCount);
        
        uint heroHealth = getHealth(msg.sender);
        uint heroDamage = getDamage(msg.sender);
        
        uint creatureHealth = creature.health * units;
        uint creatureDamage = creature.damage * units;
        
        uint heroAttacks = (creatureHealth / heroDamage) + (creatureHealth % heroDamage == 0 ? 0 : 1);
        uint craturesAttacks = (heroHealth / creatureDamage) + (heroHealth % creatureDamage == 0 ? 0 : 1);
        
        
        if (craturesAttacks < heroAttacks) {
            // creature wins
            heroHealth = 0;
        }
        else {
            if (craturesAttacks > heroAttacks) {
                // after ${hheroAttacks}, creature will be dead
                // so it cannot attacks more
                craturesAttacks = heroAttacks;
            }
            // determinate who attacks first
            if (rangedRandom(random(), 0, 1) == 1) {
                // hero attacks first, so creature lost 1 attack
                craturesAttacks -= 1;
            }
            else {
                // creature attacks first
                craturesAttacks += 1;
            }
            
            uint creatureDamageDone = craturesAttacks * creatureDamage;
            
            if (heroHealth > creatureDamageDone) {
                // player have enough helth and wins
                heroHealth -= creatureDamageDone;
            }
            else {
                heroHealth = 0;
            }
        }
        
        // won
        if (heroHealth > 0) {
            players[msg.sender].health = heroHealth;
            
            players[msg.sender].gold += creature.gold * units;
            players[msg.sender].experience += creature.experience * units;
            
            syncLevel(msg.sender); // update users level after experience gain

        
            // save Battle
            players[msg.sender].lastBattles[_creatureIdx].cType = cType;
            players[msg.sender].lastBattles[_creatureIdx].units = units;
            players[msg.sender].lastBattles[_creatureIdx].day = today;
        }
        else {
             // players will be dead until next day
            players[msg.sender].deadOn = today;
            players[msg.sender].health = getMaxHealth(msg.sender);
        }
        
        players[msg.sender].lastSynced = block.number;
    }
    
    function setPoints(uint _damagePoints, uint _healthPoints, uint _regenerationPoints) isPlayer public {
        require(_damagePoints >= players[msg.sender].damagePoints);
        require(_healthPoints >= players[msg.sender].healthPoints);
        require(_regenerationPoints >= players[msg.sender].regenerationPoints);
        
        // 5 points per level
        require(_damagePoints + _healthPoints + _regenerationPoints <= (players[msg.sender].level - 1) * 5);
        

        // add health because new health points
        // don't worry if is more than max health
        players[msg.sender].health = getHealth(msg.sender) + (5 * (_healthPoints - players[msg.sender].healthPoints));
        players[msg.sender].lastSynced = block.number;
        
        players[msg.sender].damagePoints = _damagePoints;
        players[msg.sender].healthPoints = _healthPoints;
        players[msg.sender].regenerationPoints = _regenerationPoints;
    }
    
    function getPlayer() isPlayer public view returns(
        bytes12 _username,
        uint _level,
        uint _day,
        uint _gold,
        uint _experience,
        uint _maxHealth,
        uint _damage,
        uint _healthPer100Blocks,
        uint _health,
        uint _damagePoints,
        uint _healthPoints,
        uint _regenerationPoints,
        uint _deadOn,
        uint _blockNumber
    ){
        address _addr = msg.sender;
        _username = players[_addr].username;
        _level = players[_addr].level;
        _day = getDay(_addr);
        _gold = players[_addr].gold;
        _experience = players[_addr].experience;
        _maxHealth = getMaxHealth(_addr);
        _damage = getDamage(_addr);
        _healthPer100Blocks = getHealthPer100Block(_addr);
        _health = getHealth(_addr);
        _damagePoints = players[_addr].damagePoints;
        _healthPoints = players[_addr].healthPoints;
        _regenerationPoints = players[_addr].regenerationPoints;
        _deadOn = players[_addr].deadOn;
        _blockNumber = block.number;
    }
}