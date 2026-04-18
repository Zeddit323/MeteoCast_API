import "dotenv/config";
import express from 'express';
import sequelize from "./config/db.js";
import { establishRelationship, User } from "./models/index.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.json());
app.use(cookieParser());


const corsOptions = {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
};

app.use(cors(corsOptions));

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


app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});