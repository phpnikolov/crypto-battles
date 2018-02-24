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

contract Prices {
    uint public miner = 1500;
    uint public solder = 1000;
    uint public house = 25000;
    
    function peasant(uint _castleLvl) public pure returns(uint) {
        return 5000 * _castleLvl;
    }

    function castle(uint _castleLvl) public pure returns(uint) {
        return (_castleLvl + 1) * 100000;
    }
}

contract CryptoBattles is Ownable {
    
    Prices prices = new Prices();
    
    struct Player {
        bytes12 username;
        uint lastSynced; // block number
        uint blocks;
        uint gold;
        uint experience;
        
        // units
        uint peasants;
        uint peasantsToBuy;
        uint miners;
        uint soldiers;
        
        // buildings
        uint castleLvl;
        uint houses;
    }

    // all registered players
    mapping (address => Player) private players;
    
    // holds registered usernames (username must be unique)
    mapping (bytes12 => bool) public usernames;

    modifier isPlayer() {
        require(isRegistered(msg.sender) == true);
        _;
    }
  
    function isRegistered(address _addr) public view returns(bool) {
        return players[_addr].lastSynced > 0;
    } 

    function register(bytes12 _username) public {
        require(isRegistered(msg.sender) == false);
        require(usernames[_username] == false);
        require(_username.length >= 4);
        
        usernames[_username] = true;
        players[msg.sender] = Player({
            username: _username,
            lastSynced: block.number,
            blocks: 3000,
            gold: 100000,
            experience: 0,
            
            peasants: 1,
            peasantsToBuy: 10,
            miners: 0,
            soldiers: 0,
            
            castleLvl: 1,
            houses: 1
        });
    }
    
    function getGoldPerBlock(address _addr) private view returns(uint) {
        return ((1 * players[_addr].miners) + (40 * players[_addr].castleLvl));
    }
    
    function getNotSyncedBlocks(address _addr) private view returns(uint){
        return block.number - players[_addr].lastSynced;
    }
    
    function getNotSyncedGold(address _addr) private view returns(uint){
        return getNotSyncedBlocks(_addr) * getGoldPerBlock(_addr);
    }
    
    
    // adds gold for every "block mined in the real network" since last call of this function 
    function syncPlayer(address _addr) private {
        players[_addr].gold += getNotSyncedBlocks(_addr);
        players[_addr].blocks += getNotSyncedGold(_addr);
        players[_addr].lastSynced = block.number;
    }
    
    function buyPeasants(uint _peasants) isPlayer public {
        address addr = msg.sender;
        uint price = _peasants * prices.peasant(players[addr].castleLvl);
        
        // overflow
        require(players[addr].peasants + _peasants > players[addr].peasants);

        // enough peasants to buy
        require(players[addr].peasantsToBuy >= _peasants);

        syncPlayer(addr);
        
        // enough money
        require(players[addr].gold >= price);
        
        players[addr].peasantsToBuy -= _peasants;
        players[addr].gold -= price;
        players[addr].peasants += _peasants;
    }
    
    function buyMiners(uint _miners) isPlayer public {
        address addr = msg.sender;
        uint price = _miners * prices.miner();
        
        // overflow
        require(players[addr].miners + _miners > players[addr].miners);

        // enough peasants
        require(players[addr].peasants >= _miners);

        syncPlayer(addr);
        
        // enough money
        require(players[addr].gold >= price);
        
        players[addr].peasants -= _miners;
        players[addr].gold -= price;
        players[addr].miners += _miners;
    }
    
    function buySolders(uint _solders) isPlayer public {
        address addr = msg.sender;
        uint price = _solders * prices.solder();
        
        // overflow
        require(players[addr].soldiers + _solders > players[addr].soldiers);

        // enough peasants
        require(players[addr].peasants >= _solders);

        syncPlayer(addr);
        
        // enough money
        require(players[addr].gold >= price);
        
        players[addr].peasants -= _solders;
        players[addr].gold -= price;
        players[addr].soldiers += _solders;
    }
    
    function getPlayer(address _addr) public view returns(
        bytes12 _username,
        uint _blocks,
        uint _gold,
        uint _experience,
        uint _peasants,
        uint _peasantsToBuy,
        uint _miners,
        uint _soldiers,
        uint _castleLvl,
        uint _houses
    ){
        require(isRegistered(_addr) == true);
        
        _username = players[_addr].username;
        _blocks = players[_addr].blocks + getNotSyncedBlocks(_addr);
        _gold = players[_addr].gold + getNotSyncedGold(_addr);
        _experience = players[_addr].experience;
        
        // units
        _peasants = players[_addr].peasants;
        _peasantsToBuy = players[_addr].peasantsToBuy;
        _miners = players[_addr].miners;
        _soldiers = players[_addr].soldiers;
        
        // buildings
        _castleLvl = players[_addr].castleLvl;
        _houses = players[_addr].houses;
    }
    
    function getPrices(address _addr) isPlayer public view returns(
        uint _miner,
        uint _solder,
        uint _house,
        uint _peasant,
        uint _castle
    ) {
        require(isRegistered(_addr) == true);
        
        _miner = prices.miner();
        _solder = prices.solder();
        _house = prices.house();
        _peasant = prices.peasant(players[_addr].castleLvl);
        _castle = prices.castle(players[_addr].castleLvl);
    }
}