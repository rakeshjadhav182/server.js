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

// एडमिन द्वारा फिक्स किए गए रिजल्ट्स
let forcedColor = null;
let forcedNumber = null;

setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
        const colors = ['GREEN', 'RED', 'VIOLET'];
        
        // अगर एडमिन ने सेट किया है तो वही आएगा, नहीं तो रैंडम
        systemColor = forcedColor || colors[Math.floor(Math.random() * colors.length)];
        systemNumber = (forcedNumber !== null) ? forcedNumber : Math.floor(Math.random() * 10);

        // अगले राउंड के लिए चीट रीसेट
        forcedColor = null;
        forcedNumber = null;

        io.emit('game-result', { color: systemColor, number: systemNumber });
        timeLeft = 10; 
    }

    io.emit('timer-update', timeLeft);
}, 1000);

io.on('connection', (socket) => {
    console.log('खिलाड़ी जुड़ा: ' + socket.id);

    // एडमिन से आने वाले कमांड्स सुनना
    socket.on('admin-force-color', (color) => {
        forcedColor = color;
        console.log(`Admin forced Color: ${color}`);
    });

    socket.on('admin-force-number', (num) => {
        forcedNumber = parseInt(num);
        console.log(`Admin forced Number: ${num}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`सर्वर चालू पोर्ट: ${PORT}`);
});
