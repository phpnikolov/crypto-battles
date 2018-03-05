pragma solidity ^0.4.20;

contract Ownable {
    address internal owner;

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

contract CryptoCreatures {
    enum CreatureType {
        Uknown,
        Halfling,
        Rogue,
        Pikeman,
        Nomad,
        Swordman,
        Cavalier
    }
    
    enum CreatureCount {
        Uknown,
        Few, 	// 1–4
        Several,// 5–9
        Pack,	// 10–19
        Lots,	// 20–49
        Horde	// 50–99
    }
    
    struct Creature {
        string name;
        uint damage;
        uint health;
        uint gold;
        uint experience;
    }

    
    // all creatures
    mapping (uint8 => Creature) public creatures;
    
    function CryptoCreatures() public {
        // base formula
        // gold = (damage + health) * 2
        // experience = (damage + health) * 5
        
        // Halfling
        creatures[uint8(CreatureType.Halfling)] = Creature({
            name: "Halfling",
            damage: 3,
            health: 5,
            gold: 16, // 8 * 2
            experience: 40 // 8 * 5
        });
        
        // Rogue
        creatures[uint8(CreatureType.Rogue)] = Creature({
            name: "Rogue",
            damage: 7,
            health: 5,
            gold: 36, // 12 * 3 (50% more gold)
            experience: 40 // 12 * 3.3 (50% less exp)
        });
        
        // Pikeman
        creatures[uint8(CreatureType.Pikeman)] = Creature({
            name: "Pikeman",
            damage: 7,
            health: 9,
            gold: 32, // 16 * 2
            experience: 60 // 12 * 5
        });
        
        // Nomad
        creatures[uint8(CreatureType.Nomad)] = Creature({
            name: "Nomad",
            damage: 8,
            health: 16,
            gold: 32, // 24 * 1.3 (50% less gold)
            experience: 180 // 24 * 7.5 (50% more exp)
        });
        
        // Swordman
        creatures[uint8(CreatureType.Swordman)] = Creature({
            name: "Swordman",
            damage: 15,
            health: 21,
            gold: 72, // 36 * 2
            experience: 180 // 36 * 5
        });
        
        // Cavalier
        creatures[uint8(CreatureType.Cavalier)] = Creature({
            name: "Cavalier",
            damage: 20,
            health: 40,
            gold: 80, // 60 * 1.3 (50% less gold)
            experience: 450 // 60 * 7.5 (50% more exp)
        });
    }
    
    function generateCreature(uint _level, uint _random) public pure returns(CreatureType _cType, CreatureCount _cCount){

        uint rand = _random % 100;
        
        if (_level <= 5) {
            /* Level 1-5
             * Halfling - Several (25%)
             * Rogue - Several (25%)
             * Pikeman - Few (25%)
             * Nomad - Few (25%)
             */
            if (rand < 25) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Several;
            }
            else if (rand < 50) {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Several;
            }
            else if (rand < 75) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Few;
            }
            else {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Few;
            }
        }
        else if (_level <= 10) {
            /* Level 5-10
             * Halfling - Pack (20%)
             * Rogue - Pack (20%)
             * Pikeman - Pack (20%)
             * Nomad - Several (20%)
             * Swordman - Few (20%)
             */
            if (rand < 20) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Pack;
            }
            else if (rand < 40) {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Pack;
            }
            else if (rand < 60) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Pack;
            }
            else if (rand < 80) {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Several;
            }
             else {
                _cType = CreatureType.Swordman;
                _cCount = CreatureCount.Few;
            }
        }
    }
    
}

contract CryptoItems {
    enum ItemType {
        unknown,
        Weapon,
        Helm,
        Chain,
        Ring
    }
    
    struct Item {
        ItemType iType;
        uint damagePoints;
        uint healthPoints;
        uint regenerationPoints;
    }
    
    function generateItem(uint _level, uint _random) internal pure returns(Item _item) {
        
        _item.iType = ItemType(1 + (_random % 4));
        
        
        uint maxDamagePointsPerLvl = 0;
        uint maxHealthPointsPerLvl = 0;
        uint maxRegenerationPointsPerLvl = 0;
        
        if (_item.iType == ItemType.Weapon) {
            maxDamagePointsPerLvl = 4;
        }
        else if (_item.iType == ItemType.Helm) {
            maxHealthPointsPerLvl = 3;
            maxRegenerationPointsPerLvl = 2;
        }
        else if (_item.iType == ItemType.Chain) {
            maxHealthPointsPerLvl = 4;
        }
        else if (_item.iType == ItemType.Ring) {
            maxRegenerationPointsPerLvl = 4;
        }
        
        // 25% - 100%
        uint luck = 100 - (_random % 76);

        _item.damagePoints = (maxDamagePointsPerLvl * (_level + 4)) * luck / 100;
        _item.healthPoints = (maxHealthPointsPerLvl * (_level + 4)) * luck / 100;
        _item.regenerationPoints = (maxRegenerationPointsPerLvl * (_level + 4)) * luck / 100;
        
        
    }
}

contract CryptoBattles is Ownable, Random, CryptoCreatures, CryptoItems {
    
    // ~2h
    uint roundLength = 500; // blocks
    
    struct Battle {
        CreatureType cType;
        uint units;
        uint round;
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
        
        // items
        mapping (uint8 => Item) items;
        
        
        
        uint deadOn; // round
    }

    // all registered players
    mapping (address => Player) private players;
    
    
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
            
            damagePoints: 0,
            healthPoints: 0,
            regenerationPoints: 0,
            deadOn: 0
        });
    }
    
    function getRound(address _addr) private view returns(uint) {
        return 1 + (block.number - players[_addr].registrationBlock) / roundLength;
    }
    
    function isDead(address _addr) private view returns(bool) {
        return players[_addr].deadOn == getRound(_addr);
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
        
        return 100 + (
            players[_addr].regenerationPoints + 
            players[_addr].items[0].regenerationPoints + 
            players[_addr].items[1].regenerationPoints + 
            players[_addr].items[2].regenerationPoints + 
            players[_addr].items[3].regenerationPoints + 
            players[_addr].items[4].regenerationPoints + 
            players[_addr].items[5].regenerationPoints
        ) * 10;
    }
    
    function getMaxHealth(address _addr) private view returns(uint) {
        return 
            100 + // base health
            (
                players[_addr].healthPoints +
                players[_addr].items[0].healthPoints + 
                players[_addr].items[1].healthPoints + 
                players[_addr].items[2].healthPoints + 
                players[_addr].items[3].healthPoints + 
                players[_addr].items[4].healthPoints + 
                players[_addr].items[5].healthPoints
            ) * 5;
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
        return 
            35 + // hero vase
            players[_addr].damagePoints + // damage points
            players[_addr].items[0].damagePoints + // item 0
            players[_addr].items[1].damagePoints + // item 1
            players[_addr].items[2].damagePoints + // item 2
            players[_addr].items[3].damagePoints + // item 3
            players[_addr].items[4].damagePoints + // item 4
            players[_addr].items[5].damagePoints;  // item 5

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
    
    
    function getBattlesHistory() isPlayer public view returns(
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
        uint round = getRound(_addr);
        mapping (uint8 => Battle) battles = players[_addr].lastBattles;
        
        if (players[_addr].lastBattles[0].round == round) {
            _cType0 = battles[0].cType;
            _uinits0 = battles[0].units;
        }
        
        if (battles[1].round == round) {
            _cType1 = battles[1].cType;
            _uinits1 = battles[1].units;
        }
        
        if (battles[2].round == round) {
            _cType2 = battles[2].cType;
            _uinits2 = battles[2].units;
        }
        
        if (battles[3].round == round) {
            _cType3 = battles[3].cType;
            _uinits3 = battles[3].units;
        }
        
        if (battles[4].round == round) {
            _cType4 = battles[4].cType;
            _uinits4 = battles[4].units;
        }
    }
    
    

    function getBattle(address _addr, uint round, uint8 _battleId) private view returns(CreatureType _cType, CreatureCount _cCount){
        // this random will return same number for current round
        uint staticRand = uint256(keccak256(_battleId, round, _addr));

        (_cType, _cCount) = generateCreature(players[_addr].level, staticRand);
    }
    
    
    // return daily creatures
    function getBattles() isPlayer public view returns(
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
        uint round = getRound(msg.sender);

        (_cType0, _cCount0) = getBattle(msg.sender, round, 0);
        (_cType1, _cCount1) = getBattle(msg.sender, round, 1);
        (_cType2, _cCount2) = getBattle(msg.sender, round, 2);
        (_cType3, _cCount3) = getBattle(msg.sender, round, 3);
        (_cType4, _cCount4) = getBattle(msg.sender, round, 4);
    }
    
    function fight(uint8 _battleId) isPlayer public {
        require(!isDead(msg.sender));
        
        // acepted battles 0-4
        require(_battleId < 5);
        
        uint round = getRound(msg.sender);
        
        // check if this creature is attacked this round
        require(players[msg.sender].lastBattles[_battleId].round < round);
  
        CreatureType cType;
        CreatureCount cCount;
        
        (cType, cCount) = getBattle(msg.sender, round, _battleId);

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
            players[msg.sender].lastBattles[_battleId].cType = cType;
            players[msg.sender].lastBattles[_battleId].units = units;
            players[msg.sender].lastBattles[_battleId].round = round;
        }
        else {
             // players will be dead until next round
            players[msg.sender].deadOn = round;
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
        
        players[msg.sender].damagePoints = _damagePoints;
        players[msg.sender].healthPoints = _healthPoints;
        
        // sync health before adding new regeneration points
        players[msg.sender].health = getHealth(msg.sender);
        players[msg.sender].lastSynced = block.number;
        
        players[msg.sender].regenerationPoints = _regenerationPoints;
    }
    
    function getPlayer() isPlayer public view returns(
        bytes12 _username,
        uint _level,
        uint _round,
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
        _round = getRound(_addr);
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
    
    
    
    function craftItem(address _addr, uint _round, uint8 _itemId) private view returns(Item _item, uint _price){
        // this random will change every 100 blocks or level change
        uint staticRand = uint256(keccak256(_itemId, _round, _addr));
    
        _item = generateItem(players[_addr].level, staticRand);
        
        uint cumulativeStats = _item.damagePoints + _item.healthPoints + _item.regenerationPoints;
        
        // formula: http://www.wolframalpha.com/input/?i=300%2B5*x*x;+x+from+5+to+100
        _price = 300 + 5 * cumulativeStats * cumulativeStats;
    }
    
    // item code
    // regeneration = code % 1000
    // health = (code - regeneration) % (1000 * 1000)
    // damage = (code - regeneration - health) % (1000 * 1000 * 1000)
    // type = (code - regeneration - health - damage)
    function item2code(Item _item) private pure returns(uint) {
        uint regeneration = _item.regenerationPoints % 1000;
        uint health = 1000 * (_item.healthPoints % 1000);
        uint damage = 1000 * 1000 * (_item.damagePoints % 1000);
        uint iType = 1000 * 1000 * 1000 * (uint8(_item.iType) % 1000);
        return iType + damage + health + regeneration;
    }
    
    
    
    function shop() isPlayer public view returns(
        uint _itemCode0,
        uint _price0,
        uint _itemCode1,
        uint _price1,
        uint _itemCode2,
        uint _price2,
        uint _itemCode3,
        uint _price3,
        uint _itemCode4,
        uint _price4,
        uint _itemCode5,
        uint _price5
    ) {
        uint round = getRound(msg.sender);
        Item memory item;
        (item, _price0) = craftItem(msg.sender, round, 0);
        _itemCode0 = item2code(item);
        
        (item, _price1) = craftItem(msg.sender, round, 1);
        _itemCode1 = item2code(item);
        
        (item, _price2) = craftItem(msg.sender, round, 2);
        _itemCode2 = item2code(item);
        
        (item, _price3) = craftItem(msg.sender, round, 3);
        _itemCode3 = item2code(item);
        
        (item, _price4) = craftItem(msg.sender, round, 4);
        _itemCode4 = item2code(item);
        
        (item, _price5) = craftItem(msg.sender, round, 5);
        _itemCode5 = item2code(item);
    }
    
    function buyItem(uint8 _itemId, uint _round) isPlayer public {
        require(_itemId < 6);
        
        uint round = getRound(msg.sender);
        
        // validate that user want to buy this item, not item from previous round
        require(round == _round);
        
        Item memory item;
        uint price;
        (item, price) = craftItem(msg.sender, round, _itemId);
        
        require(price <= players[msg.sender].gold);
        require(players[msg.sender].gold - price < players[msg.sender].gold);
        
        for (uint8 i = 0; i < 7; i++) {
            // throw error if there is no free spot
            require(i < 6);
            
            if (players[msg.sender].items[i].iType == ItemType.unknown) {
                // free spot
                players[msg.sender].gold -= price;
                players[msg.sender].items[i] = item;
                break;
            }
        }
    }
    
    function kill() onlyOwner public {
        selfdestruct(owner);
    }
}