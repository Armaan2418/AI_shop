import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // ✅ Proper MongoDB connection
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Ekart" // ✅ database name here instead of string concat
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        // Do not use process.exit(1) in Serverless environments
    }
};

export default connectDB;