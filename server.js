const http = require('http'),
    express = require('express'),
    socket = require('socket.io'),
    game = require('./server/js/game.js'),
    utils = require('./server/js/utils.js'),
    Player = require('./server/js/player.js'),
    { port } = require('./config/config.json');


const app = express(),
    serv = http.Server(app),
    io = socket(serv, {});

let SOCKET_LIST = {};

utils.resetLog();
app.use(express.static('client'));
serv.listen(port);

io.sockets.on('connection', function(socket) {
    socket.id = utils.uuidv4();
    socket.player = new Player();
    SOCKET_LIST[socket.id] = socket;

    socket.emit('newText', game.generateRoomDescription(socket.player));
    utils.writeLog(`Client connected: ${socket.id}`);

    socket.on('input', function(data){
        if (data.value != "") {
            let output = game.parseInputText(socket.player, data.value);
            sendText(socket, data, output);
        }
    });

    socket.on('disconnect', function() {
        utils.writeLog(`Client disconnected: ${socket.id}`);
        delete SOCKET_LIST[socket.id];
    });
});

function sendText(socket, data, output) {
    socket.emit('newText', `> ${data.value}`);
    socket.emit('newText', output);
}