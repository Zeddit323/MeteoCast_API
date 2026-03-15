import "dotenv/config";
import express from 'express';
import sequelize from "./config/db.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Everything is working!" });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});