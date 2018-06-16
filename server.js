const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
let users = [];
//specify the html we will use
app.use('/', express.static(__dirname + '/public'));
//bind the server to the 80 port
//server.listen(3000);//for local test
server.listen(3000);

//handle the socket
io.sockets.on('connection', (socket) => {
    //new user login
    socket.on('login', (nickname) => {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        }
    });
    //user leaves
    socket.on('disconnect', () => {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg', (msg, color) => {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', (imgData, color) => {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
});
