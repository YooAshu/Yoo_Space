import dotenv from "dotenv"
dotenv.config({ path: "./.env" });
import { app } from "./app.js";
import http from 'http'
import { Server } from "socket.io";
import connectDB from './src/db/index.js'
import setupSocket from "./socket.js";
import { Conversation } from "./src/models/conversation.model.js";
import cron from 'node-cron'

const port = process.env.PORT || 3000


const server = http.createServer(app); // create HTTP server manually
setupSocket(server);


connectDB()
    .then(() => {
        server.listen(port, () => {
            console.log(` Server is running on port ${port}`);
        });

        // Start cron only after DB is ready
        // This runs every hour at 0 minute
        cron.schedule('0 * * * *', async () => {
            try {
                const deleted = await Conversation.deleteMany({
                    lastMessage: { $exists: false },
                    isGroup: false,
                    createdAt: { $lt: new Date(Date.now() -  1000 * 60 * 60) },
                });

                console.log(`Deleted ${deleted.deletedCount} empty conversations`);
            } catch (err) {
                console.error('Cleanup failed:', err);
            }
        });
    })
    .catch((error) => {
        console.log(" Connection to database failed", error);
    });


app.get('/api/hello', (req, res) => {
    res.send("hello world")
}
)

