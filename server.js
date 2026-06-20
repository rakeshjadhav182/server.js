const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } 
});

let timeLeft = 10;
let systemColor = "GREEN";
let systemNumber = 0;

// ?? 1 ????? ??? ???? ???? ???????????? ?????
setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
        const colors = ['GREEN', 'RED', 'VIOLET'];
        systemColor = colors[Math.floor(Math.random() * colors.length)];
        systemNumber = Math.floor(Math.random() * 10);

        io.emit('game-result', { color: systemColor, number: systemNumber });
        timeLeft = 10; 
    }

    io.emit('timer-update', timeLeft);
}, 1000);

io.on('connection', (socket) => {
    console.log('?? ??? ??????? ?????: ' + socket.id);
});

// Render ?? ??? ????? ?? ???????? ???? ????? ??
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`????? ???? ?? ??? ?? ?????: ${PORT}`);
});