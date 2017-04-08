#!/usr/bin/env node

'use strict';
var path = require('path');
var P2PConnector = require( path.resolve( __dirname, "./main.js" ) ); 

var http_port = process.env.HTTP_PORT;
var p2p_port = process.env.P2P_PORT;
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : []; 


var p2pconnector = new P2PConnector(http_port, p2p_port, initialPeers);
p2pconnector.connectToPeers(initialPeers);
p2pconnector.initHttpServer();
p2pconnector.initP2PServer();
