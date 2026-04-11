import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/db.js';

// 1. IMPORT ROUTES
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js'; 
import aiRoute from './routes/aiRoute.js'; // Added this

const app = express();

/**
 * 3. MIDDLEWARE SETUP
 */
const PORT = process.env.PORT || 8000;

// ── CORS — allow localhost in dev + production Vercel domain ──────────────
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
];
// Add production frontend URL from env (set this in Railway/Render)
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
    // Also allow without trailing slash variant
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Allow any *.vercel.app subdomain (preview deployments)
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ── Explicit OPTIONS preflight handler — required for iOS Safari —————————
app.options('*', cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());             
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());             

/**
 * 4. API ROUTES
 */
app.use('/api/v1/user', userRoute);
app.use('/v1/user', userRoute); // for Vercel

app.use('/api/products', productRoute); 
app.use('/products', productRoute); // for Vercel

app.use('/api/v1/ai', aiRoute);
app.use('/v1/ai', aiRoute); // for Vercel // Added this: URL will be http://localhost:8000/api/v1/ai/get

/**
 * 5. HEALTH CHECK
 */
app.get("/", (req, res) => {
    res.status(200).json({ 
        success: true,
        message: "E-kart Backend is active!",
        port: PORT 
    });
});

/**
 * 6. SERVER INITIALIZATION
 */
const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB Connected Successfully");

        // Listen for Vercel Web Services or Local Dev
        app.listen(PORT, () => {
            console.log(`🚀 Server running at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server failed to start:", error.message);
        process.exit(1); // Let Railway restart the service on failure
    }
};

startServer();

// Export the Express API for Vercel
export default app;