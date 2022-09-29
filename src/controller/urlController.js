const mongoose = require("mongoose");
const urlModel = require("../models/urlModel");
const validUrl = require('valid-url');
const shortid = require('shortid');
require('dotenv').config()
// ================================================create-url============================================

const createUrl = async function (req, res) {
    const longUrl = req.body.longUrl;
  
    const baseUrl = process.env.baseUrl;
  
    if (!longUrl)
      return res.status(400).send({ status: false, msg: "please provide url." });
      
  
    if (!validUrl.isUri(longUrl))
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid url." });
  
        const checkUrl = await urlModel.findOne({longUrl : longUrl})
        if(checkUrl) return res.status(400).send({ msg : "url already shortened",shortUrl:checkUrl.shortUrl})
  
    const urlCode = shortid.generate(longUrl);
    const shortUrl = baseUrl + urlCode;
  
    const url = { longUrl: longUrl, urlCode: urlCode, shortUrl: shortUrl }; 
  
    const createUrlData= await urlModel.create(url)
  
    
  
    return res.status(201).send({ status: true, data : createUrlData });
  };


const geturl = async (req, res) => {
    try {
      const url = await urlModel.findOne({ urlCode: req.params.shorten });
                                             
      if (url) {
        return res.redirect(url.longUrl);
      } else {
        return res.status(404).send({status:false, msg:'No url found'});
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({status:false, msg:err.message});
    }
  }


module.exports={createUrl,geturl}