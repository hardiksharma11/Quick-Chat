const mongoose = require('mongoose');
const dotenv= require('dotenv')
dotenv.config();
const mongoURI = process.env.MONGO_URI;


const connectDb = () => {

    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(`${mongoURI}`,()=>{
            console.log("Connected to MongoDb");
        })
       

    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit();
    }

}

module.exports = connectDb;