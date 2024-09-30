import express from 'express';
import cors from 'cors';
import auth from '../src/routes/auth/userauth.js';
import connectDB from '../src/config/mongo.js'; 
import FileUpload from '../src/routes/db/embedding.js'
import chatPrompt from '../src/routes/chat/chat.js'
import genai from '../src/routes/chat/genai.js'

//Initalizing express application
const app = express();
const port = process.env.PORT || 5000;

//Initalizing the mongoDB connection
connectDB();

//Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
app.use('/chat',chatPrompt)
app.use('/auth', auth); 
app.use('/fileupload',FileUpload)
app.use('/genai', genai)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// export default app;
