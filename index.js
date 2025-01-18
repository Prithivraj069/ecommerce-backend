const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./database');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> {
    res.json({
        message: " welcome to the api world"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})