const express=require('express')
const router=express.Router()
const urlController =require("../controller/urlController")

router.post('/shorten',urlController.createUrl)
router.get('/:shorten',urlController.geturl)



router.all("/*", function (req, res) {
    res.status(400).send("Invalid request....!!!");
  });







module.exports = router;