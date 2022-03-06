const path=require('path');
const fs=require('fs');
const solc=require('solc');


//genrate path for solidity file
const lotteryPath=path.resolve(__dirname,'contract','Lottery.sol');

//getting source code from solidity file
const source=fs.readFileSync(lotteryPath,'utf-8');

//source is code we read from file and 1 is the number of contracts we are attempting to compile
//Exporting the object that contains bytecode property and interface(ABI)    
module.exports=solc.compile(source,1).contracts[':Lottery'];