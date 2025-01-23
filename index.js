const express = require('express');
const cors = require('cors');
require('dotenv').config();

// const pool = require('./database');
const productRouter = require('./routes/products');
const userRouter = require('./routes/users');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

app.get('/', (req, res)=> {
    res.json({
        message: " welcome to the api world"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})