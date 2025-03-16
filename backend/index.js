import dotenv from "dotenv"
dotenv.config({ path: "./.env" });
import { app } from "./app.js";
import connectDB from './src/db/index.js'
const port = process.env.PORT || 3000


connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log("connection failed to database", error);

    })

app.get('/api/hello', (req, res) => {
    res.send("hello world")
}
)

