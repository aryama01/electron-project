const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI );
        console.log(" MongoDB Connected (Chat Storage)");
    } catch (error) {
        console.error(" DB Connection Failed:", error);
    }
}

module.exports = connectDB;
