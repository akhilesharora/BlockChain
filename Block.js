var CryptoJS = require("crypto-js")
var fs = require('fs')


class Block {
    constructor(index, previousHash, timestamp, data) {
            this.index = index
            this.previousHash = previousHash
            this.timestamp = timestamp
            this.data = data
            // this.hash = hash
        }
	}
   

class BlockChain
	{

		constructor()
			{
       			this.blockchain = [this.getGenesisBlock()] 
       		}
    

    	getGenesisBlock
    		{    

    		}


    	getDateTime() 
    		{
        		return new Date().getTime() 
        	}

    
    	generateNewBlock(data,index,previousHash,latestBlockIndex)
	    	{
	    		var directory = path.resolve( __dirname) + '/Blocks'

	   			if (latestBlockIndex == 0)
	   				{
	   	   				var block = new Block(0, Null, this.getDateTime(), data) 
	   	   			}      
	       

	    		else
	    			{
	   	   				var block = new Block(index, previousHash, this.getDateTime(), data) 
	   	   			}
	    

	   			writeToFile( directory , '/Block' + block.index + '.txt', formatBlockObjectToJson(block))
	    		return block, calculateHash(block.index, block.previousHash, block.timestamp, block.data)
		    
	    	}
	}



function calculateHash(index, previousHash, timestamp, data) {
   	return CryptoJS.SHA256(index + previousHash + timestamp + data).toString() }
    


// Create content for the block text file.    
function formatBlockObjectToJson(block)
	{
    	var json = 
    		{
	   			index: block.index,
	    		previoushash: block.previousHash,
	    		timestamp: block.timestamp,
	    		data: block.data,
    		}
    	return JSON.stringify(json)
	}


// Function for saving the block to disk .
function writeToFile(directory, file, data)
	{    
        CreateDirectory(directory)        
        fs.writeFile(directory + file, data, function(err) 
        	{
            	if(err) 
            		{
                		return console.log(err);
            		}
        	})

        console.log("The file was saved!");
	}


// Function for creating the directory for saving blocks locally.
function CreateDirectory(directory) 
	{
        mkdirp(directory, function (err) 
        	{
            	if (err)
            		{
                		console.error(err)
            		} 
            	else
            		{
                		console.log('Blocks Directory Created')
           			}
        	})
    }

module.exports = Blockchain