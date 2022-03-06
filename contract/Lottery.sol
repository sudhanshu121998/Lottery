pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether); //require helps to check some condition for execution of below code
        players.push(msg.sender); //enter the address of player in players array
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players)); //returns the random index
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        //reseting the players array after winner if picked
        players = new address[](0); //initalized the dynamic array with length 0
    }
    //Helps to reduce the duplicate code
    modifier restricted() {
        require(msg.sender == manager);
        _;  //copies the code of function where this modifier is used and execute totally with above lines
    }
    
    function getPlayers()  public view returns (address[]) {
        return players; //returns list of all players
    }
    
}   