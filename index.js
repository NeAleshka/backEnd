const express = require('express');
const mongoose = require('mongoose');
const router = require("./router");
const app = express();
const cors=require('cors')
const cookieParser=require('cookie-parser')
require('dotenv').config()

app.use(cors())
app.use(cookieParser())
app.use(express.json());
app.use('/auth', router);

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        app.listen(PORT, () => {
            console.log(`мы тут на ${PORT} порту запустились`)
        });
    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}

start();



