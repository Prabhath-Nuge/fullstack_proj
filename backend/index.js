import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import session from "express-session";
import { sessionMiddleware } from "./middelware/sessionMiddleware.js";

import customerRoutes from "./routes/customer.router.js";
import roomRouter from "./routes/room.router.js";
import serviceRouter from "./routes/service.router.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(session({
    secret: 'secret-key', // Replace with a secure key
    resave: false,             // Prevent resaving session if not modified
    saveUninitialized: false,  // Don't save uninitialized sessions
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day (in milliseconds)
    },
})
);
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));


app.use("/", customerRoutes);
app.use("/rooms", roomRouter);
app.use("/services", serviceRouter);



app.listen(port, ()=>{
    connectDB();
    console.log(`connected port ${port}`);
});