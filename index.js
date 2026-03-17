import "dotenv/config";
import express from 'express';
import sequelize from "./config/db.js";
import { establishRelationship, User } from "./models/index.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";

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
        const userCount = await User.count();
        console.log(`The user count is: ${userCount}.`);
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}

await startDatabaseConnection();


app.use('/auth', authRoutes);
app.use('/cities', cityRoutes);


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});