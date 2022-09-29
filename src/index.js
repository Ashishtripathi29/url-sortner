const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const route=require('./routes/route')
require('dotenv').config()

const app=express()

app.use(bodyParser.json())



mongoose.connect(process.env.str, {
    useNewUrlParser: true
}).then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


    app.use('/', route);


app.listen(process.env.PORT, function () {
    console.log('Express app running on port ' + (process.env.PORT))
});