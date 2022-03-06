const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

//Intialize web3 instant using Web3 constructor function and passing the ganache provider
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let lottery; //holds instance of contract
let accounts; //holds list of all different account that are automatically generated

//Deploying the contract and also getting the list of accounts 
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  //Deploys lottery contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe('Lottery Contract',()=>{
    it('Deploys a contract',()=>{
        assert.ok(lottery.options.address);
    });
    it('Allow one account to enter', async ()=>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.05','ether') //returns equivalent wei 
        });

        const players= await lottery.methods.getPlayers().call({
            from :accounts[0]
        });

        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    });
    it('Allow multiple accounts to enter', async ()=>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.05','ether') //returns equivalent wei 
        });
        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.05','ether') //returns equivalent wei 
        });
        await lottery.methods.enter().send({
            from : accounts[2],
            value : web3.utils.toWei('0.05','ether') //returns equivalent wei 
        });

        const players= await lottery.methods.getPlayers().call({
            from :accounts[0]
        });

        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(3,players.length);
    });
    it('Requires Minimum amount of ether',async()=>{
        try{
            await lottery.methods.enter().send({
                from : accounts[0],
                value : web3.utils.toWei('0','ether') //returns equivalent wei 
            });
        }
        catch(err){
            assert.ok(err);
        } 
    });
    it('Only Manager can call pickWinner',async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from : accounts[1],
                value : web3.utils.toWei('0','ether') //returns equivalent wei 
            });
            assert(false); //fails the test if error is not thrown
        }
        catch(err){
            assert(err);
        } 
    }); 
    it('Sends money to winner and reset contract',async()=>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('2','ether') //returns equivalent wei 
        });
        const initialBalance=await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from:accounts[0]});
        const finalBalance= await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        assert(difference> web3.utils.toWei('1.8','ether'));
        
    });
});