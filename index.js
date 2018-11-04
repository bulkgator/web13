const express = require("express");
const mysql = require("mysql");
const bodyparser = require("body-parser");
var Web3 = require("web3");
var fs = require("fs");

const abi = require("./model/tokenAbi");

const app = express();
app.listen(9000);

app.use(bodyparser.urlencoded({extended : false}));
app.get("/api/getBalance/:addr/:symbol", function(req, res){
    var json = {
        "address": req.params.addr,
        "symbol": req.params.symbol
    }
    var JSONLint = JSON.stringify(json, 0, 4);

    var url = "http://localhost:8545";
    var infura = "https://mainnet.infura.io/v3/049318b8624a4fb19c70fb853d1a620e";
    var wss = "wss://mainnet.infura.io/ws/049318b8624a4fb19c70fb853d1a620e";
    var web3 = new Web3(Web3.givenProvider || infura);
 
    
    // web3.eth.getBalance(req.params.addr, (err, wei) => {
    //     balance = web3.utils.fromWei(wei, 'ether')
    //     res.send(balance);
    //   })
   
    var parsed = JSON.parse(fs.readFileSync(__dirname + '/model/ABI/'+req.params.symbol+'.json', 'utf8'));
    var contractAddress = JSON.parse(fs.readFileSync(__dirname + '/model/ABI/ContractAddrss/'+req.params.symbol+'.json', 'utf8'));
    var decimal = JSON.parse(fs.readFileSync(__dirname + '/model/ABI/decimals/'+req.params.symbol+'.json', 'utf8'));
   

   


    var contract = new web3.eth.Contract(parsed, contractAddress.address);
    
    contract.methods.balanceOf(req.params.addr).call((err, result) =>{
        if(err){
            res.send(err);
            console.log("Error"+ err) 
        }else{
            var balance  = 0;
           
           
            if(decimal.decimals == 18){
               
                 balance = web3.utils.fromWei(result, 'ether');
            }else if(decimal.decimals == 8){
                balance = web3.utils.fromWei(result+"0000000000", 'ether');
            }else if(decimal.decimals == 0){
                balance = result;
            }
          
            res.send((balance));
            
            

        }
        
    })

        
    // contract.methods.totalSupply().call((err, result) =>{
    //     if(err){
    //         res.send(err);
    //         console.log("Error"+ err) 
    //     }else{
         
            
    //         var balance  = 0;
           
           
    //         if(decimal.decimals == 18){
               
    //              balance = web3.utils.fromWei(result, 'ether');
    //         }else if(decimal.decimals == 8){
    //             balance = web3.utils.fromWei(result+"0000000000", 'ether');
    //         }else if(decimal.decimals == 0){
    //             balance = result;
    //         }
          
    //         res.send((balance));  

    //     }
        
    // })

   

    // contract.events.Transfer({}, {fromBlock: 6631845, toBlock: 'pending'}, (err, result) => {
    //     console.log("connected to node");
    //     if(err){
    //         console.log("dd"+err);
    //     }else{
    //         console.log("dd"+result);
    //     }
       
        
    // })

    // contract.events.Transfer({}, {fromBlock: 0, toBlock: 'latest'}, (error, result) =>{
    //     console.log("Started")
    //     if (error) {
    //         console.log("Erro "+error)
    //         res.send(error);
    //     }else if(result){
    //         console.log("result");
    //     }
    //   })
    // var birthEvent = contract.events.Transfer(eventHandler);

    // function eventHandler(error, result) {
    //         if(!error) { console.log("*** Kitty born:", result); }
    //         else { console.log("*** Birth event handler error", error); }
    // };

})


app.get("/api/abi/:symbol", function(req, res){
    try {
       abi.getAbi(req.params.symbol, function(err, data){
            if (err) {
                throw err  
            } else {
                res.send(data);
            }
       }) 
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post("/api/abi", function(req, res){

});

app.put("/api/abi/:symbol", function(req, res){

});


app.delete("/api/abi/:symbol", function(req, res){

});