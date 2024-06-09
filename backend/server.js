import express from 'express';
import cors from 'cors';
import auth from './routes/auth/userauth.js';
import connectDB from './config/mongo.js'; 
import FileUpload from './routes/db/embedding.js'
const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.use('/auth', auth); 
app.use('/fileupload',FileUpload)
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
