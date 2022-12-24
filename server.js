require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const user = require('./routes/userRoutes');





const PORT = process.env.PORT || 9000
const app = express();

// Database connection
const DB_URL = process.env.MONGO_URL_PRO
mongoose.set('strictQuery', true);
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})

    .then((result) => {
        app.listen(PORT, () => {
            console.log(`server listening on port: ${PORT} connected to DB @ ${DB_URL}`)
        })
        
    })
    


// Core middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    origin: "https://investment.hashroi.online"

}));
app.use(helmet());



app.use('/api/user', user)
