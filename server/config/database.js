const mongoose= require('mongoose');
require('dotenv').config();

const dbConnect= () => {
    const DB_URI= process.env.DB_URI;
    mongoose.connect(DB_URI)
    .then(() => console.log("DATABASE CONNECTED SUCCESSFULLY"))
    .catch(err => console.log("DATABASE CONNECTION FAILED",err))
}

module.exports = dbConnect;