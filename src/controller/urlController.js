const mongoose = require("mongoose");
const urlModel = require("../models/urlModel");
const validUrl = require('valid-url');
const shortid = require('shortid');
module.exports = {
 createUrl : async function (req, res) {
    const longUrl = req.body.longUrl;
  
    const baseUrl = "localhost:3000/";

    if (!longUrl)
      return res.status(400).send({ status: false, msg: "please provide url." });
  
    if (!validUrl.isUri(longUrl))
      return res.status(400).send({ status: false, msg: "please provide valid url." });
  
        const checkUrl = await urlModel.findOne({longUrl : longUrl})
        if(checkUrl) return res.status(400).send({status : false, msg : "url already used"})
  
    const urlCode = shortid.generate(longUrl);
    const shortUrl = baseUrl + urlCode;
  
    const url = { longUrl: longUrl, urlCode: urlCode, shortUrl: shortUrl }; 
    const createUrlData= await urlModel.create(url)
  
    return res.status(201).send({ status: true, data : createUrlData });
  
},
geturl : async (req, res) => {
    try {
      const url = await urlModel.findOne({ urlCode: req.params.shorten });
                                             
      if (url) {
        return res.redirect(url.longUrl);
      } else {
        return res.status(404).json('No url found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  }
}
