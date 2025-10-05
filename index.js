const express = require('express');
const app = express();
const path = require('path');
// socket.io server setup---
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

require('dotenv').config();
const Port = process.env.PORT || 2001
const connectdb = require('./config/mongo-db.js')
connectdb(process.env.MONGODB_URI)
const cors = require('cors');
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.send("Home Page !!")
})
const authroute = require('./routes/auth-routes.js')
app.use('/users/', authroute)

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chatroom.html')
})
app.use("/signup", express.static(path.join(__dirname, 'public', 'signup-page.html')))
app.use("/login", express.static(path.join(__dirname, 'public', 'login-Page.html')))



io.on('connection', (socket) => {
    console.log('User Connected');
    socket.on('send-name', (username) => {
        io.emit('send-name', (username));
    });
    socket.on('send-msg', (chat) => {
        io.emit('send-msg', (chat));
        // console.log(chat)
    });
    socket.on('disconnect', () => {
        console.log('User Disconnect')
    })

})





// app.listen(Port, (req, res) => {
//     console.log(`Server running on ${Port}`)
// })

server.listen(Port, () => {
    console.log(`Server running on ${Port}`)
})