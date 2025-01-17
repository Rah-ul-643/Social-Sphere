const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY; 

const { retreiveChatHistory, handleSendMessageEvent, updateOnlineUsers, handleRetrieveConversations, disconnectionHandler } = require('../controllers/socketController');

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

io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        console.log("authentication error");
        return next(new Error('Authentication error'));
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log("invalid token");
            return next(new Error('Authentication error'));
        }
        socket.user = decoded.username; 
        next();
    });
});


io.on('connection', (socket) => {
    
    console.log(` '${socket.user}' connected with id: ${socket.id} `);

    io.to(socket.id).emit('set-username',socket.user);

    updateOnlineUsers(io, socket);

    socket.on('retrieve-conversations', (cb) => {
        handleRetrieveConversations( socket.user, cb);
    })

    socket.on('chat-history', (groupId, cb) => {
        retreiveChatHistory(groupId, cb, socket);
    });

    socket.on('send-msg', (msg, groupId ) => {
        handleSendMessageEvent(msg, socket.user, groupId, io);
    });
    
    socket.on('disconnect', () => {
        disconnectionHandler(io,socket)
    });
});

module.exports = { server, app };
