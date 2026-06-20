const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } 
});
// 
const MONGO_URI = 'mongodb+srv://rakeshjadhav182:roziwin182@cluster0.zh6ang4.mongodb.net/?appName=Cluster0';
let timeLeft = 10;
let systemColor = "GREEN";
let systemNumber = 0;

// हर 1 सेकंड में चलने वाला सेंट्रलाइज्ड टाइमर
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
    console.log('एक नया खिलाड़ी जुड़ा: ' + socket.id);
});

// Render के लिए पोर्ट को डायनामिक रखना जरूरी है
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`सर्वर चालू हो गया है पोर्ट: ${PORT}`);
});