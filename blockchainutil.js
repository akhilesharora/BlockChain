var CryptoJS = require("crypto-js")
var fs = require('fs')
var path = require('path')
var Blockchain = require(path.resolve( __dirname, "./Block.js"))
var fs = require('fs');
var mkdirp = require('mkdirp');


function getDateTime() 
    {
        return new Date().getTime()
    }


function getLatestBlockDataFromFile(callback)
    {
        var directory = path.resolve( __dirname) + '/Blocks/'
        var files = fs.readdirSync(directory);
        var latestIndex = files.length-1
        ReadFile(directory + 'Block' + latestIndex + '.txt', function gettingLatestBlock(data){
        callback(data)
        })
    }

function getLatestBlockIndexFromNetwork(callback)
    {
        
    }

// Sync local block with the network and loads the last block data into memory
function syncLocalBlocks()
    {

    }   

function ReadFile(file, callback)
    {
        fs.readFile(file, 'utf8', function readingFile(err,data) {
        if (err) 
            {
                return console.log(err);
            }
        callback(data)
        })
    } 

// Proposing a new block to peers after a transaction.

function proposeNextBlock(blockData) {
        syncLocalBlocks()
        var previousBlock = this.getLatestBlockDataFromFile()
        var nextIndex = previousBlock.index + 1
        var nextTimeStamp = this.getDateTime()
        var nextHash = this.calculateHash(nextIndex, previousBlock.hash, nextTimeStamp, blockData)
        return new Block(nextIndex, previousBlock.hash, nextTimeStamp, blockData, nextHash)
    }

// Send/recieve network requests .

function queryAllMsg() 
    {
        var message = {'type': 1}            
        return message
    }

function responseChainMsg() 
    {
        var message =  {'type': 2,'data': JSON.stringify(BlockChainUtil.blockchain)}
        return message
    }

function responseLatestMsg() 
    {
        var message = {'type': 2,'data': JSON.stringify([BlockChainUtil.getLatestBlock()]) }
        return message
    }


function networkMessage(ws) 
    {
        ws.on('message', function(data)
        {
            var message = JSON.parse(data);
            console.log('Received message' + JSON.stringify(message))

            switch (message.type) 
                {
                    case 1://self.QUERY_ALL // ask for full blockchain
                        write(ws, self.responseChainMsg())
                        break

                    case 2://this.RESPONSE_BLOCKCHAIN// respond with full blockchain.
                        handleNetworkResponse(message)
                        break

                    case 3: //QUERY_LATEST //respond with pending blocks
                        write(ws, responseLatestMsg());
                        break
                }
        })
    }


function handleNetworkResponse(message) 
    {
        var receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index))
        var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1]

        validateReceivedBlockChain(receivedBlocks, function(result)
        {
            if(result == 0)
                {
                    console.log("We can append the received block to our chain")
                    addToBlockChain(latestBlockReceived)
                    broadcast(responseLatestMsg())
                } 

            else if (result == -1)
                {
                    console.log("Received blockchain is longer than current blockchain");
                    replaceChain(receivedBlocks)
                    broadcast(responseLatestMsg())
                }

            else
                {
                    console.log('Received blockchain is not longer than the current blockchain. Do nothing');
                    broadcast(responseChainMsg())
                }
        })
              
    }

function write (ws, message)
    {
        ws.send(JSON.stringify(message))
    } 


function broadcast(message) 
    {
        for(var socket in this.sockets)
            {
                write(sockets[socket], message)
            }
    }

function addBlock(newBlock)
    {
        console.log('newBlock:' + newBlock)
        console.log('latestBlock:' + this.getLatestBlock())
        if (this.isValidNewBlock(newBlock, this.getLatestBlock())) 
            {
                console.log('Pushed to chain/n')
                this.blockchain.push(newBlock);
            }
    }

function isValidNewBlock(newBlock, previousBlock) 
    {
        if (previousBlock.index + 1 !== newBlock.index) 
            {
                console.log('invalid index')
                return false
            } 
        else if (previousBlock.hash !== newBlock.previousHash) 
            {
                console.log('invalid previoushash');
                return false
            }
        else if (this.calculateHashForBlock(newBlock) !== newBlock.hash) 
            {
                console.log(typeof (newBlock.hash) + ' ' + typeof this.calculateHashForBlock(newBlock))
                console.log('invalid hash: ' + this.calculateHashForBlock(newBlock) + ' ' + newBlock.hash)
                return false
            }
        return true
    }


function replaceChain(newBlocks) 
    {
        if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) 
            {
                console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
                this.blockchain = newBlocks
            } 
        else 
            {
                console.log('Received blockchain invalid')
            }
    }


function isValidChain(blockchainToValidate)
    {
        if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(this.getGenesisBlock())) 
            {
                return false
            }
        
        var tempBlocks = [blockchainToValidate[0]]
        for (var i = 1; i < blockchainToValidate.length; i++) 
            {
                if (this.isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) 
                    {
                        tempBlocks.push(blockchainToValidate[i])
                    } 
                else 
                    {
                        return false
                    }
            }
        return true
    }

    
function validateReceivedBlockChain(receivedBlocks, callback) 
    {
        getLatestBlockFromFile(function(latestBlockInFile)
            {
                var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];                    
                var latestBlockHeld = JSON.parse(latestBlockInFile)
            
                if (latestBlockReceived.index > latestBlockHeld.index) 
                    {
                        console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
        
                        if (latestBlockHeld.hash === latestBlockReceived.previousHash) 
                            {
                                console.log("--We can append the received block to our chain");
                                callback(0);
                            } 
                        else 
                            {
                                console.log("--Received blockchain is longer than current blockchain");
                                callback(-1);
                            }
                    } 
                else 
                    {
                        console.log('--received blockchain is not longer than current blockchain. Do nothing');
                    }
            });
        
    }
    
  
module.exports = BlockChainUtil


    
