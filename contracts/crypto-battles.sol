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
    
    function maxRandom() private returns (uint256 randomNumber) {
        seed = uint256(keccak256(
            seed,
            block.blockhash(block.number - 1),
            block.coinbase,
            block.difficulty
        ));
    return seed;
  }


  function random(uint min, uint max) internal returns (uint256 randomNumber) {
      require(min < max);

    uint r = maxRandom() % (max - min + 1);
    return min + r;
  }
}


contract CryptoBattles is Ownable, Random {
    struct Player {
        bytes12 username;
        uint lastSynced; // block number
        uint diamonds;
        uint experience;
        uint life;
        
        uint strengthPoints;
        uint vitalityPoints;
        uint intelligencePoints;
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
        require(_username.length >= 4);

        players[msg.sender] = Player({
            username: _username,
            lastSynced: block.number,
            diamonds: 1000,
            experience: 0,
            life : 100,
            
            strengthPoints:0,
            vitalityPoints:0,
            intelligencePoints:0
            
        });
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
        uint _diamonds,
        uint _experience,
        uint _strength,
        uint _vitaility,
        uint _intelligence,
        uint _life
    ){
        require(isRegistered(_addr) == true);
        _username = players[_addr].username;
        _diamonds = players[_addr].diamonds;
        _experience = players[_addr].experience;
        _strength = getStrength(_addr);
        _vitaility = getVitaility(_addr);
        _intelligence = getIntelligence(_addr);
        _life = getLife(_addr);
    }
}