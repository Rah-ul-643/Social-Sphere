const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
require('dotenv').config();

const { handleConnectionRequest, handleSendMessageEvent, setUserId, getUsers, disconnectionHandler } = require('../controllers/socketController');

const CLIENT_URL = process.env.CLIENT_URL;
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: CLIENT_URL, 
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('User connected with id: ' + socket.id);

    socket.on('setUserId', (username) => {
        setUserId(io,socket, username)
    });

    socket.on('getUsers', (username,cb) => {
        getUsers( username, cb);
    })

    socket.on('connection-request', (groupId, cb) => {
        handleConnectionRequest(groupId, cb, socket);
    });

    socket.on('send-msg', (msg, sender, groupId ) => {
        handleSendMessageEvent(msg, sender, groupId, socket);
    });

    
    socket.on('disconnect', () => {
        disconnectionHandler(io,socket)
    });
});

module.exports = { server, app };
