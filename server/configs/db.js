import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Mongoose connected to DB");
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
        
    }
    catch (error) {
        console.log(error.message);
    }
};

export default connectDB;