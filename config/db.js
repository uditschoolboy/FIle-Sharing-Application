require('dotenv').config();
const mongoose = require('mongoose');

//Function to connect to atlas DB
function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_CONNECTION_URL,
            { }, () => { console.log("DB connected") }
        );
    } catch (e) {
        console.log("Not connected");
    }
}

module.exports = connectDB;