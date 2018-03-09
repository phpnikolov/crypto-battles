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

contract Zipper {

    
    function zipUint24(uint24 _p0, uint24 _p1, uint24 _p2, uint24 _p3, uint24 _p4) internal pure returns(uint _zipUint16) {
        // uint24 can hold 16,777,215
        uint maxSize = 16777215;
        _zipUint16 = 
            (_p0 * maxSize**0) +
            (_p1 * maxSize**1) + 
            (_p2 * maxSize**2) + 
            (_p3 * maxSize**3) + 
            (_p4 * maxSize**4);
    }
    
    function unzipUint24(uint _zipUint24)  internal pure returns(uint24[5]) {
            // uint24 can hold 16,777,215
            uint maxSize = 16777215;
            
            uint24 _p0 = uint24(_zipUint24 % maxSize);
            _zipUint24 = (_zipUint24 - _p0) / maxSize;
            
            uint24 _p1 = uint24(_zipUint24 % maxSize);
            _zipUint24 = (_zipUint24 - _p1) / maxSize;
            
            uint24 _p2 = uint24(_zipUint24 % maxSize);
            _zipUint24 = (_zipUint24 - _p2) / maxSize;
            
            uint24 _p3 = uint24(_zipUint24 % maxSize);
            _zipUint24 = (_zipUint24 - _p3) / maxSize;
            
            uint24 _p4 = uint24(_zipUint24 % maxSize);
            _zipUint24 = (_zipUint24 - _p4) / maxSize;
            
            return [_p0, _p1, _p2, _p3, _p4];
            
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
        // max 255!!!
    }
    
    struct Creature {
        uint16 damage;
        uint16 health;
        uint24 gold;
        uint24 experience;
    }

    
    // all creatures
    mapping (uint8 => Creature) public creatures;
    
    function CryptoCreatures() public {
        // base formula
        // gold = damage * 10
        // experience = health * 5
        
        // Halfling
        creatures[uint8(CreatureType.Halfling)] = Creature({
            damage: 2,
            health: 11,
            gold: 20,
            experience: 55
        });
        
        // Rogue
        creatures[uint8(CreatureType.Rogue)] = Creature({
            damage: 4,
            health: 11,
            gold: 40, 
            experience: 55 
        });
        
        // Pikeman
        creatures[uint8(CreatureType.Pikeman)] = Creature({
            damage: 4,
            health: 23,
            gold: 40,
            experience: 115
        });
        
        // Nomad
        creatures[uint8(CreatureType.Nomad)] = Creature({
            damage: 5,
            health: 38,
            gold: 50,
            experience: 190
        });
        
        // Swordman
        creatures[uint8(CreatureType.Swordman)] = Creature({
            damage: 12,
            health: 33,
            gold: 120,
            experience: 165
        });
        
        // Cavalier
        creatures[uint8(CreatureType.Cavalier)] = Creature({
            damage: 10,
            health: 77,
            gold: 100,
            experience: 385
        });
    }
    
    function generateCreature(uint _level, uint _random) internal pure returns(CreatureType _cType, CreatureCount _cCount){

        uint rand = _random % 100;
        
        if (_level <= 5) {
            /* Level 1-5
             * Halfling - Several (20%)  - easy
             * Pikeman - Few (20%) - easy
             * Rogue - Several (20%) - normal
             * Nomad - Few (20%) - normal
             * Halfling - Pack (20%) - normal
             */
            if (rand < 20) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Several;
            }
             else if (rand < 40) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Few;
            }
            else if (rand < 60) {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Several;
            }
            else if (rand < 80) {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Few;
            }
            else {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Pack;
            }
        }
        else if (_level <= 10) {
            /* Level 5-10
             * Rogue - Several (20%) - easy
             * Pikeman - Several (20%) - normal
             * Halfling - Pack (20%) - normal
             * Nomad - Several (20%) - hard
             * Swordman - Few (20%) - normal
             */
            if (rand < 20) {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Several;
            }
            else if (rand < 40) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Several;
            }
            else if (rand < 60) {
                _cType = CreatureType.Halfling;
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
        else if (_level <= 15) {
            /* Level 10-15
             * Halfling - Pack (20%) - easy
             * Pikeman - Several (20%) - easy
             * Nomad - Several (20%) - normal
             * Rogue - Pack (20%) - normal
             * Swordman - Several (20%) - hard
             */
            if (rand < 20) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Pack;
            }
            else if (rand < 40) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Several;
            }
            else if (rand < 60) {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Several;
            }
            else if (rand < 80) {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Pack;
            }
            else {
                _cType = CreatureType.Swordman;
                _cCount = CreatureCount.Several;
            }
        }
        else if (_level <= 20) {
            /* Level 15-20
             * Cavalier	- Few (20%) - easy
             * Rogue - Pack (20%) - easy
             * Pikeman - Pack (20%) - normal
             * Swordman - Several (20%) - normal
             * Nomad - Pack (20%) - hard
             */
            if (rand < 20) {
                _cType = CreatureType.Cavalier;
                _cCount = CreatureCount.Few;
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
                _cType = CreatureType.Swordman;
                _cCount = CreatureCount.Several;
            }
            else {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Pack;
            }
        }
        else if (_level <= 30) {
            /* Level 20-30
             * Pikeman - Pack (20%) - easy
             * Swordman - Several (20%) - easy
             * Halfling - Lots (20%) - normal
             * Cavalier - Several (20%) - hard
             * Rogue - Lots (20%) - hard
             */
            if (rand < 20) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Pack;
            }
            else if (rand < 40) {
                _cType = CreatureType.Swordman;
                _cCount = CreatureCount.Several;
            }
            else if (rand < 60) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Lots;
            }
            else if (rand < 80) {
                _cType = CreatureType.Cavalier;
                _cCount = CreatureCount.Several;
            }
            else {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Lots;
            }
        }
        else if (_level <= 40) {
            /* Level 30-40
             * Halfling - Lots (20%) - easy
             * Nomad - Pack (20%) - easy
             * Rogue - Lots (20%) - normal
             * Pikeman - Lots (20%) - hard
             * Swordman - Pack (20%) - hard
             */
            if (rand < 20) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Lots;
            }
            else if (rand < 40) {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Pack;
            }
            else if (rand < 60) {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Lots;
            }
            else if (rand < 80) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Lots;
            }
            else {
                _cType = CreatureType.Swordman;
                _cCount = CreatureCount.Pack;
            }
        }
        else if (_level <= 50) {
            /* Level 40-50
             * Rogue - Lots (20%) - easy
             * Pikeman - Lots (20%) - normal
             * Swordman - Pack (20%) - normal
             * Halfling - Horde (20%) - normal
             * Cavalier - Pack (20%) - hard
             */
            if (rand < 20) {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Lots;
            }
            else if (rand < 40) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Lots;
            }
            else if (rand < 60) {
                _cType = CreatureType.Swordman;
                _cCount = CreatureCount.Pack;
            }
            else if (rand < 80) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Horde;
            }
            else {
                _cType = CreatureType.Cavalier;
                _cCount = CreatureCount.Pack;
            }
        }
        else if (_level <= 65) {
            /* Level 50-65
             * Pikeman - Lots (20%) - easy
             * Swordman - Pack (20%) - easy
             * Halfling - Horde (20%) - normal
             * Cavalier - Pack (20%) - normal
             * Nomad - Lots (20%) - hard
             */
            if (rand < 20) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Lots;
            }
            else if (rand < 40) {
                _cType = CreatureType.Swordman;
                _cCount = CreatureCount.Pack;
            }
            else if (rand < 60) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Horde;
            }
            else if (rand < 80) {
                _cType = CreatureType.Cavalier;
                _cCount = CreatureCount.Pack;
            }
            else {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Lots;
            }
        }
        else if (_level <= 80) {
            /* Level 65-80
             * Halfling - Horde (20%) - easy
             * Cavalier - Pack (20%) - easy
             * Nomad - Lots (20%) - normal
             * Rogue - Horde (20%) - normal
             * Pikeman - Horde (20%) - hard
             */
            if (rand < 20) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Horde;
            }
            else if (rand < 40) {
                _cType = CreatureType.Cavalier;
                _cCount = CreatureCount.Pack;
            }
            else if (rand < 60) {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Lots;
            }
            else if (rand < 80) {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Horde;
            }
            else {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Horde;
            }
        }
        else {
            /* Level > 80
             * Halfling - Horde (15%) - easy
             * Rogue - Horde (10%) - easy
             * Pikeman - Horde (15%) - normal
             * Nomad - Lots (15%) - normal
             * Nomad - Horde (10%) - hard
             * Swordman - Lots (15%) - normal
             * Swordman - Horde (5%) - imppossible
             * Cavalier	- Lots (10%) - hard
             * Cavalier - Horde (5%) - imppossible
             */
            if (rand < 15) {
                _cType = CreatureType.Halfling;
                _cCount = CreatureCount.Horde;
            }
            else if (rand < 25) {
                _cType = CreatureType.Rogue;
                _cCount = CreatureCount.Horde;
            }
            else if (rand < 40) {
                _cType = CreatureType.Pikeman;
                _cCount = CreatureCount.Horde;
            }
            else if (rand < 55) {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Lots;
            }
            else if (rand < 65) {
                _cType = CreatureType.Nomad;
                _cCount = CreatureCount.Horde;
            }
            else if (rand < 80) {
                _cType = CreatureType.Swordman;
                _cCount = CreatureCount.Lots;
            }
            else if (rand < 85) {
                _cType = CreatureType.Swordman;
                _cCount = CreatureCount.Horde;
            }
            else if (rand < 95) {
                _cType = CreatureType.Cavalier;
                _cCount = CreatureCount.Lots;
            }
            else {
                _cType = CreatureType.Cavalier;
                _cCount = CreatureCount.Horde;
            }
        }
    }
    
}

contract CryptoItems {
    enum ItemType {
        unknown,
        Mace,
        Sword,
        Helm,
        Chain,
        Ring
    }
    
    struct Item {
        ItemType iType;
        uint16 damage;
        uint16 health;
        uint16 regeneration; // per 10 blocks
    }
    
    function generateItem(uint8 _level, uint _random) internal pure returns(Item _item) {
        
        _item.iType = ItemType(1 + (_random % 5));
        
        uint16 maxDamagePerLvl = 0;
        uint16 maxHealthPerLvl = 0;
        uint16 maxRegenerationPerLvl = 0;
        
        if (_item.iType == ItemType.Mace) {
            maxDamagePerLvl = 4;
        }
         if (_item.iType == ItemType.Sword) {
            maxDamagePerLvl = 3;
            maxHealthPerLvl = 10;
        }
        else if (_item.iType == ItemType.Helm) {
            maxHealthPerLvl = 15;
            maxRegenerationPerLvl = 2;
        }
        else if (_item.iType == ItemType.Chain) {
            maxHealthPerLvl = 20;
        }
        else if (_item.iType == ItemType.Ring) {
            maxRegenerationPerLvl = 4;
        }
        
        // 25% - 100%
        uint16 luck = 100 - uint16(_random % 76);

        _item.damage = (maxDamagePerLvl * _level * luck / 100);
        _item.health = (maxHealthPerLvl * _level * luck / 100);
        _item.regeneration = (maxRegenerationPerLvl * _level * luck / 100);
        
        
    }
}

contract CryptoBattles is Ownable, CryptoCreatures, CryptoItems, Random, Zipper {
    
    struct Battle {
        CreatureType cType;
        uint8 units;
        uint24 round;
    }
    
    struct Player {
        bytes12 username;
        uint registrationBlock;
        uint lastSynced; // block number
        uint8 level;
        uint gold;
        uint experience;
        
        uint points; // when player gain level, he gets 5 points
        
        uint currentHealth;
        uint damage;
        uint health;
        uint regeneration; // per 10 blocks

        uint deadOn; // round
    }
    
    // players unique usernames
    mapping (bytes12 => bool) public usedUsernames;

    // all registered players
    mapping (address => Player) public players;
    
    // player items (items is codded into uints with zipUint24 method) - type, damage, health, regeneration
    mapping (address => uint[8]) private items;
    
    // flag to disable item from the shop, after purchased (itemId => round)
    mapping (address => uint[6]) private purchasedOn;
    
    // player past battles (creature id => zipUint24) - round, cType, units
    mapping (address => uint[6]) private pastBattles;
    
    modifier isPlayer() {
        require(isRegistered(msg.sender) == true);
        _;
    }
  
    function isRegistered(address _addr) public view returns(bool) {
        return players[_addr].lastSynced > 0;
    } 

    function register(bytes12 _username) public {
        require(isRegistered(msg.sender) == false);
        require(usedUsernames[_username] == false);

        usedUsernames[_username] = true;
        players[msg.sender] = Player({
            username: _username,
            registrationBlock: block.number,
            lastSynced: block.number,
            level: 1,
            gold: 1000,
            experience: 0,
            
            points: 0,
            
            currentHealth: 100,
            damage: 35,
            health : 100,
            regeneration: 10, // 10 health per 10 blocks (1 health per block)

            deadOn: 0
        });
    }
    
    function getInfo() isPlayer public view returns(
        uint _round,
        uint _blockNumber,
        uint _currentHealth,
        bool _isDead
        ) {
            _round = getRound(msg.sender);
            _blockNumber = block.number;
            _currentHealth = getHealth(msg.sender);
            _isDead = isDead(msg.sender);
        }

    // new round every 500 blocks (~2h)
    function getRound(address _addr) private view returns(uint) {
        return 1 + (block.number - players[_addr].registrationBlock) / 500;
    }
    
    function isDead(address _addr) private view returns(bool) {
        return players[_addr].deadOn == getRound(_addr);
    }

    
    // How many experience is needed for a certain level http://www.wolframalpha.com/input/?i=50*(x+-+1)(x+%2B+18);+x+from+1+to+99
    function getLevelSize(uint _level) private pure returns(uint) {
        return (50 * (_level - 1) * (_level + 18));
    }
    
    function syncLevel(address _addr) private {
        while (players[_addr].experience >= getLevelSize(players[_addr].level + 1)) {
            players[_addr].level++;
            players[_addr].points+=5;
            
        }
    }
    
    function getHealth(address _addr) private view returns(uint) {
        if (isDead(_addr)) {
            return 0;
        }
        uint notSyncedBlocks = (block.number - players[_addr].lastSynced);
        uint notSyncedHealth =  notSyncedBlocks * players[_addr].regeneration / 10;
        
        if (players[_addr].currentHealth + notSyncedHealth > players[_addr].health) {
            // full health
            return players[_addr].health;
        }
        
        return players[_addr].currentHealth + notSyncedHealth;
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
    
    // (creature id => zipUint24) - round, cType, units
    function getPastBattles() isPlayer public view returns(uint[6] ) {
        return pastBattles[msg.sender];
    }
    
    

    function getBattle(address _addr, uint round, uint8 _battleId) private view returns(CreatureType, CreatureCount){
        // this random will return same number for current round
        uint staticRand = uint256(keccak256(_battleId, round, _addr));

        return generateCreature(players[_addr].level, staticRand);
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
        CreatureCount _cCount4,
        CreatureType _cType5,
        CreatureCount _cCount5
    ){
        uint round = getRound(msg.sender);

        (_cType0, _cCount0) = getBattle(msg.sender, round, 0);
        (_cType1, _cCount1) = getBattle(msg.sender, round, 1);
        (_cType2, _cCount2) = getBattle(msg.sender, round, 2);
        (_cType3, _cCount3) = getBattle(msg.sender, round, 3);
        (_cType4, _cCount4) = getBattle(msg.sender, round, 4);
        (_cType5, _cCount5) = getBattle(msg.sender, round, 5);
    }
    
    
    function fight(uint8 _battleId) isPlayer public {
        require(!isDead(msg.sender));
        
        // acepted battles 0-5
        require(_battleId < 6);
        
        uint round = getRound(msg.sender);
        
        // check if this creature is attacked this round
        uint24[5] memory _pastBattle = unzipUint24(pastBattles[msg.sender][_battleId]);
        
        require(_pastBattle[0] < round);
  
        CreatureType cType;
        CreatureCount cCount;
        
        (cType, cCount) = getBattle(msg.sender, round, _battleId);

        Creature memory creature = creatures[uint8(cType)];
        
        
        uint units = creatureCount2Number(cCount);
        uint creatureHealth = creature.health * units;
        
        // how many attacks are needed to defeat the creature
        uint attacksNeeded = ((creatureHealth - 1) / players[msg.sender].damage) + 1;
        
        if (_battleId % 2 == 0) {
            // on even _battleId, player attacks first
            attacksNeeded -= 1;
        }
        
        
        uint creatureDamageDone = attacksNeeded * creature.damage * units;
        
        uint heroHealth = getHealth(msg.sender);
        
        // won
        if (heroHealth > creatureDamageDone) {
            heroHealth -= creatureDamageDone;
            players[msg.sender].gold += creature.gold * units;
            players[msg.sender].experience += creature.experience * units;
            
            syncLevel(msg.sender); // update users level after experience gain
       
            // save Battle
            pastBattles[msg.sender][_battleId] = zipUint24(uint24(round), uint24(cType), uint24(units),  0, 0);
        }
        else {
             // players will be dead until next round
            players[msg.sender].deadOn = round;
            heroHealth = 0;
        }
        
        players[msg.sender].currentHealth = heroHealth;
        players[msg.sender].lastSynced = block.number;
    }
    
    function setPoints(uint _damagePoints, uint _healthPoints, uint _regenerationPoints) isPlayer public {

        uint usedPoints = _damagePoints + _healthPoints + _regenerationPoints;
        require(players[msg.sender].points >= usedPoints);

  
        // sync health before adding new regeneration points
        players[msg.sender].currentHealth = getHealth(msg.sender);
        players[msg.sender].lastSynced = block.number;
        
        players[msg.sender].points -= usedPoints;
        
        players[msg.sender].damage += _damagePoints * 1;
        players[msg.sender].health += _healthPoints * 5;
        
        players[msg.sender].regeneration += _regenerationPoints;
    }
    
    
    function getItem(address _addr, uint _round, uint8 _itemId) private view returns(Item) {
        // next generation item every 5 lvls
        uint8 level = 5 + ((players[_addr].level / 5) * 5);
        
        // this random will change every 100 blocks or level change
        uint staticRand = uint256(keccak256(_itemId, _round, _addr, level));
    
        return generateItem(level, staticRand);
    }
    
    function getItemPrice(Item _item) private pure returns(uint24) {
        uint cumulativeStats = _item.damage + (_item.health / 5) + _item.regeneration;
        
        // formula: http://www.wolframalpha.com/input/?i=50*x%2B(x%2F2)*x;+x+from+10+to+90
        return uint24(50*cumulativeStats + ((cumulativeStats / 2) * cumulativeStats));
    }
    
    // zip order - type, damage, health, regeneration, price
    function shop() isPlayer public view returns(uint[6]) {
        uint round = getRound(msg.sender);

        Item memory item;
        
        uint zip0;
        uint zip1;
        uint zip2;
        uint zip3;
        uint zip4;
        uint zip5;
        
        // check if this item is already purchased
        if (purchasedOn[msg.sender][0] != round) {
            item =  getItem(msg.sender, round, 0);
            zip0 = zipUint24(uint24(item.iType), item.damage, item.health, item.regeneration, getItemPrice(item));
        }
        
        if (purchasedOn[msg.sender][1] != round) {
            item =  getItem(msg.sender, round, 1);
            zip1 = zipUint24(uint24(item.iType), item.damage, item.health, item.regeneration, getItemPrice(item));
        }
        
        if (purchasedOn[msg.sender][2] != round) {
            item =  getItem(msg.sender, round, 2);
            zip2 = zipUint24(uint24(item.iType), item.damage, item.health, item.regeneration, getItemPrice(item));
        }
        
        if (purchasedOn[msg.sender][3] != round) {
            item =  getItem(msg.sender, round, 3);
            zip3 = zipUint24(uint24(item.iType), item.damage, item.health, item.regeneration, getItemPrice(item));
        }
        
        if (purchasedOn[msg.sender][4] != round) {
            item =  getItem(msg.sender, round, 4);
            zip4 = zipUint24(uint24(item.iType), item.damage, item.health, item.regeneration, getItemPrice(item));
        }
        
        if (purchasedOn[msg.sender][5] != round) {
            item =  getItem(msg.sender, round, 5);
            zip5 = zipUint24(uint24(item.iType), item.damage, item.health, item.regeneration, getItemPrice(item));
        }

        
        return [zip0, zip1, zip2, zip3, zip4, zip5];
    }
    
   function buyItem(uint8 _itemId, uint _round) isPlayer public {
        require(_itemId < 6);
        
        uint round = getRound(msg.sender);
        
        // validate that user want to buy this item, not item from previous round
        require(round == _round);
        
        // check if this item is already purchased
        require(purchasedOn[msg.sender][_itemId] < round);
        
        Item memory item = getItem(msg.sender, round, _itemId);
        uint price = getItemPrice(item);
        
        require(price <= players[msg.sender].gold);
        require(players[msg.sender].gold - price < players[msg.sender].gold);
        
        for (uint8 i = 0; i < 9; i++) {
            // throw error if there is no free spot
            require(i < 8);
            
            if (items[msg.sender][i] == 0) {
                // free spot
                players[msg.sender].gold -= price;
                players[msg.sender].damage += item.damage;
                players[msg.sender].health += item.health;
                players[msg.sender].regeneration += item.regeneration;
                
                
                items[msg.sender][i] = zipUint24(uint24(item.iType), item.damage, item.health, item.regeneration, 0);
                purchasedOn[msg.sender][_itemId] = round;
                break;
            }
        }
    }
    
    function sellItem(uint8 _slotId) isPlayer public {
        require(_slotId < 8);
        
        require(items[msg.sender][_slotId] > 0);
        
        uint24[5] memory itemStats = unzipUint24(items[msg.sender][_slotId]);
        Item memory item = Item({
           iType: ItemType(itemStats[0]),
           damage: uint16(itemStats[1]),
           health: uint16(itemStats[2]),
           regeneration: uint16(itemStats[3])
        });
        
        // half of the real price
        uint price = getItemPrice(item) / 2;
        
        // remove item stats from the player
        players[msg.sender].damage -= item.damage;
        players[msg.sender].health -= item.health;
        players[msg.sender].regeneration -= item.regeneration;
        items[msg.sender][_slotId] = 0;
        
        // pay to the player
        players[msg.sender].gold += price;
    }
    
    // items that player has (max 8)
    function getItems() isPlayer public view returns(uint[8]) {
        return items[msg.sender];
    }

    function kill() onlyOwner public {
        selfdestruct(owner);
    }
}