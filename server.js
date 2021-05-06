const http = require('http'),
    express = require('express'),
    socket = require('socket.io'),
    game = require('./server/js/game.js'),
    utils = require('./server/js/utils.js'),
    player = require('./server/js/player.js');

const app = express(),
    serv = http.Server(app),
    io = socket(serv, {});

let SOCKET_LIST = {};

utils.resetLog();
app.use(express.static('client'));
serv.listen(3000);

io.sockets.on('connection', function(socket) {
    socket.id = utils.uuidv4();
    socket.player = player.newPlayer();
    SOCKET_LIST[socket.id] = socket;

    socket.emit('newText', game.generateRoomDescription(socket.player));
    utils.writeLog(`Client connected: ${socket.id}`);

    socket.on('input', function(data){
        if (data.value != "") {
            let command = game.parseInputText(socket.player, data.value);
            sendText(socket, command);
        }
    });

    socket.on('disconnect', function() {
        utils.writeLog(`Client disconnected: ${socket.id}`);
        delete SOCKET_LIST[socket.id];
    });
});

function sendText(socket, command) {
    let output = game.parseCommand(socket.player, command);
    socket.emit('newText', `> ${data.value}`);
    socket.emit('newText', output);
}