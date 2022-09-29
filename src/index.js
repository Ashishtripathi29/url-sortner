const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const route=require('./routes/route')

const app=express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Ashish_Tripathi29:Ashish555@cluster0.bxcrqqa.mongodb.net/group18Database", {
    useNewUrlParser: true
}).then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


    app.use('/', route);


app.listen(process.env.PORT||3000, function () {
    console.log('Express app running on port ' + (3000||process.env.PORT))
});