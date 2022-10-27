const mongoose = require("mongoose");
const urlModel = require("../models/urlModel");
const validUrl = require('valid-url');
const shortid = require('shortid');
require('dotenv')
const redis = require("redis")
const { promisify } = require("util");
//redis connection


const redisClient = redis.createClient(
  18191,
  "redis-18191.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("pyXsGZIaAuIJu5acS4q6pAEwgHIyfnfC", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const set = promisify(redisClient.SET).bind(redisClient)
const get = promisify(redisClient.GET).bind(redisClient)

module.exports ={
 createUrl : async function (req, res) {
  try{
    const longUrl = req.body.longUrl;
    const baseUrl = process.env.baseUrl;
  
    if (!longUrl)
      return res.status(400).send({ status: false, msg: "please provide url." });
  
    if (!validUrl.isWebUri(longUrl))
      return res.status(400).send({ status: false, msg: "please provide valid url." });
  
        const checkUrl = await urlModel.findOne({longUrl : longUrl})
        if(checkUrl) return res.status(400).send({ msg : "url already shortened",shortUrl:checkUrl.shortUrl})
  
    const urlCode = shortid.generate(longUrl);
    const shortUrl = baseUrl + urlCode;
  
    const url = { longUrl: longUrl, urlCode: urlCode, shortUrl: shortUrl }; 
    const createUrlData= await urlModel.create(url)
   
    return res.status(201).send({ status: true, data : createUrlData });}
     catch (err) {
      console.error(err);
      res.status(500).send({status:false, msg:err.message});
    }
},
  


 geturl : async (req, res) => {
    try {
      let geturldata = await get(`${req.params.urlCode}`)
      
      if(geturldata) return res.status(302).redirect(geturldata);
      else{
        const url = await urlModel.findOne({ urlCode: req.params.urlCode });
        
      if (url) {
        await  set(`${req.params.urlCode}`,(url.longUrl))                     
        return res.status(302).redirect(url.longUrl);
      } else {
        return res.status(404).send({status:false, msg:'No url found'});
      }}
    } catch (err) {
      console.error(err);
      res.status(500).send({status:false, msg:err.message});
    }
  }
}