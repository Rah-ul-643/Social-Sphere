const express = require('express');
const cors = require('cors');
require('dotenv').config();

const CLIENT_URL = process.env.CLIENT_URL;

const userRoutes = require('./api routes/userRoutes');
const chatRoutes = require('./api routes/chatRoutes');

const connectDB = require('./config/database');
const {server,app} = require('./socket/socketServer');


// middlewares

app.use(express.json());    // json parser


app.use(cors({              // cors middleware
  
  origin: CLIENT_URL, 
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: 'Content-Type,Authorization' 
}));


//Routes config

app.use('/api/', userRoutes);
app.use('/api/', chatRoutes);

// server event listener setup

server.listen(4000, () => {
  connectDB();
  console.log('server listening on port 4000');
});
