const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://abhaydevadev7:1A1WC566oZ1FSTJB@cluster0.pkdl9ye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToMongo;
