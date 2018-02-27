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


contract CryptoBattles is Ownable {
    struct Player {
        bytes12 username;
        uint lastSynced; // block number
        uint gold;
        uint experience;
        uint life;
        
        uint strengthPoints;
        uint vitalityPoints;
        uint intelligencePoints;
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
            gold: 1000,
            experience: 0,
            
            strengthPoints:0,
            vitalityPoints:0,
            intelligencePoints:0,
            life : 100
        });
    }
    
    
    function getUnsyncedBlocks(address _addr) private view returns(uint) {
        return block.number - players[_addr].lastSynced;
    }
    
    function syncPlayer(address _addr) private {
        players[_addr].life = getLife(_addr);
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
    
    function getLifePerBlock(address _addr) private view returns(uint) {
        return (1 * getIntelligence(_addr));
    }
    
    function getMaxLife(address _addr) private view returns(uint) {
        return getVitaility(_addr) * 5;
    }
    
    function getLife(address _addr) private view returns(uint) {
        uint notSyncedLife = getUnsyncedBlocks(_addr) * getLifePerBlock(_addr);
        
        if (players[_addr].life + notSyncedLife > getMaxLife(_addr)) {
            return getMaxLife(_addr);
        }
        
        return  players[_addr].life + notSyncedLife;
    }
    
    function getDamage(address _addr) private view returns(uint) {
        return getStrength(_addr) * 1;
    }
    
    function getPlayer(address _addr) public view returns(
        bytes12 _username,
        uint _gold,
        uint _experience,
        uint _strength,
        uint _vitaility,
        uint _intelligence,
        uint _life,
        uint _maxLife,
        uint _damage
    ){
        require(isRegistered(_addr) == true);
        
        _username = players[_addr].username;
        _gold = players[_addr].gold;
        _experience = players[_addr].experience;
        _strength = getStrength(_addr);
        _vitaility = getVitaility(_addr);
        _intelligence = getIntelligence(_addr);
        _life = getLife(_addr);
        _maxLife = getMaxLife(_addr);
        _damage = getDamage(_addr);
    }
}