"use-strict";

const express = require('express'),
    path = require('path'),
    game = require(path.join(__dirname, '/server/js/game.js')),
    util = require(path.join(__dirname, '/server/js/utils.js')),
    app = express(),
    serv = require('http').Server(app),
    io = require('socket.io')(serv, {}),
    port = 3000;

let SOCKET_LIST = {};

util.resetLog();
app.use(express.static(path.join(__dirname,'client')));
serv.listen(port);

io.sockets.on('connection', function(socket) {
    game.newPlayer(socket);
    SOCKET_LIST[socket.id] = socket;

    socket.on('input', function(data){
        if (data.value != "") {
            socket.emit('newText', `> ${data.value}`);
            let command = game.parseInput(data.value);
            sendText(socket, command);
        }
    });

    socket.on('disconnect', function() {
        util.writeLog(`Client disconnected: ${socket.id}`)
        delete SOCKET_LIST[socket.id];
    });
});

function sendText(socket, command) {
    let output = parseCommand(socket, command);
    socket.emit('newText', output);
}

function parseCommand(socket, command) {
    let output = '';
    if (command == 'showInv') {
        output = game.showInv(socket.inventory);
    } else if (command == 'help') {
        output = game.help();
    } else if (command[0] == 'travel') {
        socket.location = game.travel(socket.location, command[1]);
        output = game.roomDesc(socket);
    }
    return output;
}