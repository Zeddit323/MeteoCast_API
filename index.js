import "dotenv/config";
import express from 'express';
import sequelize from "./config/db.js";
import { establishRelationship } from "./models/index.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Everything is working!" });
});

establishRelationship();

const startDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}

await startDatabaseConnection();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});