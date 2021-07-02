const https = require("https");
var axios = require('axios');

const customAxios = async (asset) => {
  var myData = JSON.stringify({
    "page": 1,
    "fiat": "ARS",
    "tradeType": "BUY",
    asset,
    "rows": 10,
    "payTypes": [],
    "publisherType": null
  });
  const config = {
    method: 'post',
    url: "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
    headers: { 
        'Content-Type': 'application/json'
    },
    data: myData
  };
  const finalData = await axios(config)
  let mediaValue = 0;
  finalData.data.data.forEach(element => {
    mediaValue = mediaValue + parseFloat(element.adv.price)
  });
  return mediaValue/10;
}

module.exports = {customAxios};
