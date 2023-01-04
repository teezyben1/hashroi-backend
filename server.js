require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const user = require('./routes/userRoutes');





const PORT = process.env.PORT || 8000
const app = express();

// Database connection
const DB_URL = process.env.MONGO_URL_DEV
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
    


// Core middleware/
app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
//     next();
// });



app.use('/api/user', user)
app.get('/',(req, res) => {
    res.json({
            message: 'Hello World'
        })
})