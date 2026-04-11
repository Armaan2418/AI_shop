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
// Add production frontend URL from env (set this in Railway dashboard)
if (process.env.FRONTEND_URL) {
    const url = process.env.FRONTEND_URL.replace(/\/$/, '');
    if (!allowedOrigins.includes(url)) allowedOrigins.push(url);
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

// Dedicated health-check for Railway
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
});


/**
 * 6. SERVER INITIALIZATION
 * ─────────────────────────────────────────────────────────────────────────
 * IMPORTANT: Start the HTTP server FIRST, then connect to MongoDB.
 * Railway healthcheck hits '/' immediately after deploy. If we wait for DB
 * first, the healthcheck times out and Railway kills the container.
 * Binding to '0.0.0.0' is required — Railway won't route to 'localhost'.
 */
const startServer = async () => {
    // 1. Start HTTP server immediately so Railway healthcheck succeeds
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
    });

    // 2. Connect to MongoDB in background — server stays alive either way
    try {
        await connectDB();
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed (server still running):", error.message);
        // Don't exit — let Railway keep the container alive.
        // DB-dependent routes will return 500; healthcheck '/' still returns 200.
    }
};

startServer();

// Export the Express API for Vercel
export default app;