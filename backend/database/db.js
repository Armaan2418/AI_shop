import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Ekart",
            serverSelectionTimeoutMS: 10000, // fail fast — don't hang Railway healthcheck
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        throw error; // let server.js handle this and call process.exit(1)
    }
};

export default connectDB;