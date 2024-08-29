import express from 'express';
import cors from 'cors';
import { connect, getDb } from './src/mongo';

const app = express();

app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

// Connect to MongoDB and start the server
app.listen(2323, async () => {
    console.log('listening on port http://localhost:2323');
    try {
        await connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World');
});



// Import and use routes
import("./src/routes/users");
import("./src/routes/cards");


export default app;
