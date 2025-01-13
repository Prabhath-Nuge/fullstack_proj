import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import session from "express-session";
import { sessionMiddleware } from "./middelware/sessionMiddleware.js";
import { createServer } from "http";
import { Server } from "socket.io";

import customerRoutes from "./routes/customer.router.js";
import roomRouter from "./routes/room.router.js";
import serviceRouter from "./routes/service.router.js";
import publicRouter from "./routes/public.router.js";
import bookingRouter from "./routes/booking.router.js";
import adminRouter from "./routes/admin.router.js";
import { Socket } from "./socket.io.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {});

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
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
app.use("/book", bookingRouter);
app.use("/", publicRouter);
app.use("/admin", adminRouter);


Socket(io);








server.listen(port, () => {
    connectDB();
    console.log(`connected port ${port}`);
});