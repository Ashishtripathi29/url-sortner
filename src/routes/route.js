const express=require('express')
const router=express.Router()

router.get("/demo/:name",function(req,res){
    const a=req.params.name
    console.log(a)
    res.send("done")
})













module.exports = router;