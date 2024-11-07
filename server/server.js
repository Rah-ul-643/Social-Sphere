const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookie_parser = require('cookie-parser');

const CLIENT_URL = process.env.CLIENT_URL;

const userRoutes = require('./api routes/userRoutes');
const chatRoutes = require('./api routes/chatRoutes');

const connectDB = require('./config/database');
const {server,app} = require('./socket/socketServer');

const auth = require('./middlewares/auth');

// middlewares

app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());   
app.use(express.json());    // json parser


app.use(cors({              // cors middleware
  
  origin: CLIENT_URL, 
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: 'Content-Type,Authorization' ,
  credentials: true
}));


//Routes config


app.use('/api/user/', userRoutes);
app.use('/api/chat/', auth, chatRoutes);


// server event listener setup

server.listen(4000, () => {
  connectDB();
  console.log('server listening on port 4000');
});
