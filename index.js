const express = require('express');
const mongoose = require('mongoose');
const router = require("./authRouter.js");
const app = express();
const cors = require('cors')

app.use(cors)
app.use(express.json());
app.use('/auth', router);

const PORT = 5000;

async function start() {
    try {
        await mongoose.connect('mongodb+srv://admin:43agitin@cluster0.lhm5obg.mongodb.net/?retryWrites=true&w=majority');
        app.listen(PORT, () => {
            console.log(`мы тут на ${PORT} порту запустились`)
        });
    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}

start();


/*app.post('/',async (req,res)=>{
    try {
        const {name,lastName,phone}=req.body
        const post=await User.create({name,lastName,phone})
        res.json(post)
    }
   catch (e) {
       res.status(500).json(e.message)
   }
})*/

