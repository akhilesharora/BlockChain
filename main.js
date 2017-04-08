'use strict';

var path = require('path')
var BlockChainUtil = require(path.resolve( __dirname, "./blockchainutil.js"))
var express = require("express")
var bodyParser = require('body-parser')
var WebSocket = require("ws")


class P2PConnector{
    
        constructor(httpport, p2pport, initialpeers){
            this.http_port = httpport || 3001
            this.p2p_port = p2pport || 6001
            this.initialPeers = initialpeers
            this.sockets = []
            this.QUERY_ALL = 1
            this.RESPONSE_BLOCKCHAIN = 2
            BlockChainUtil = new BlockChainUtil()
        }

    
        initHttpServer(){
            
            var self = this
            
            var app = express()
            app.use(bodyParser.json())

            app.get('/getAllBlock', function(req, res) { 
                res.send(JSON.stringify(BlockChainUtil.getBlockChain()))
            })
            
//            app.post('/newRequest', function(req, res){
//                var data = JSON.parse(req.body.data)
//                
//            })

            app.post('/mineBlock', function(req, res){
                var newBlock = BlockChainUtil.proposeNextBlock(req.body.data)
                BlockChainUtil.addBlock(newBlock)
                self.broadcast(self.responseLatestMsg())
                console.log('block added: ' + JSON.stringify(newBlock))
                res.send()
            })

            app.get('/peers', function(req, res) {
                var self = this 
                res.send(self.sockets.forEach((socket)=>{
                    socket
                })) 

                //res.send(self.sockets.map(function(s) {
                  //  console.log(s)
                    //s._socket.remoteAddress + ':' + s._socket.remotePort
                //})) 

            })

            app.post('/addPeer', function(req, res) {
                this.connectToPeers([req.body.peer])
                res.send()
            })
            
            app.listen(this.http_port, () => console.log('Listening http on port: ' + this.http_port))
        }


        initP2PServer() {
            var server = new WebSocket.Server({port: this.p2p_port})
            var self = this
            server.on('connection', function(ws){
                self.initConnection(ws)
            })
            
            console.log('listening websocket p2p port on: ' + this.p2p_port)
        }

        initConnection(ws) {
            this.sockets.push(ws)
            this.initMessageHandler(ws)
            this.initErrorHandler(ws)
            //this.write(ws, this.queryAllMsg())
        }


        // initMessageHandler(ws) {

        //     var self = this
            
        //     ws.on('message', function(data){
                
        //         var message = JSON.parse(data);
        //         console.log('Received message' + JSON.stringify(message))

        //         switch (message.type) {
        //             case 1://self.QUERY_ALL
        //                 self.write(ws, self.responseChainMsg())
        //                 break

        //             case 2://this.RESPONSE_BLOCKCHAIN
        //                 self.handleBlockchainResponse(message)
        //                 break
        //         }
        //     })
        // }

        initErrorHandler(ws) {
            var self = this

            ws.on('close', function(){
                self.closeConnection(ws)})
            
            ws.on('error', function() {
                self.closeConnection(ws)})
        }
    
        closeConnection(ws) {
                console.log('connection failed to peer: ' + ws.url)
                this.sockets.splice(this.sockets.indexOf(ws), 1)
            }

        connectToPeers(newPeers) {
            var self = this
            
            for(var peer in newPeers){
                var ws = new WebSocket(newPeers[peer]);

                ws.on('open', function() {
                    self.initConnection(ws)
                })

                ws.on('error', function() {
                    console.log('connection failed')
                })
            }
        }


module.exports = P2PConnector
