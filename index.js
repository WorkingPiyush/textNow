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

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.send("Home Page !!")
})


app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chatroom.html')
})

io.on('connection', (socket) => {
    socket.on('send-name', (username) => {
        io.emit('send-name', (username));
        // console.log(username)
    });
    socket.on('send-msg', (chat) => {
        io.emit('send-msg', (chat));
        // console.log(chat)
    });
})





// app.listen(Port, (req, res) => {
//     console.log(`Server running on ${Port}`)
// })

server.listen(Port, () => {
    console.log(`Server running on ${Port}`)
})