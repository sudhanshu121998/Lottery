const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile.js");

//Setting up HDWaller provider (pass the Account Mnemonic)
const provider = new HDWalletProvider(
  "pool canvas hour mesh police element expand crush vote genre laptop trend",
  "https://rinkeby.infura.io/v3/cea18fe5854d4ed684096063c3c83e67"
);
const web3 = new Web3(provider);


const deploy = async () => {
  //Get list of all accounts
  const accounts = await web3.eth.getAccounts();
  console.log('Attemping to deploy from accounts',accounts[0]);

  //Creating object of Contract and passing interface to it
  const result = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({
    data: bytecode
  })
  .send({
    from: accounts[0],
    gas: "1000000",
  });

  console.log('Contract Deployed to',result.options.address);
  //To prevent a hanging deployment
  provider.engine.stop;
};
deploy();

