"use strict";
var express = require('express');
const Shopify = require('shopify-api-node');
const cors = require('cors');
var bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/', async function (req, res) {

    const shopify = await new Shopify({
        shopName: req.body.shopName,
        accessToken: req.body.accessToken
    });


    let id, products, discounts;
    await shopify.theme.list().then((themes) => {
        id = themes[0].id;
    });
    await shopify.product.list().then((elements) => {
        // products.forEach(product => {
        //  console.log(product.title, product.id);
        // });
        products = elements;
    });
    await shopify.priceRule.list().then((elements) => {
        //  discounts.forEach(discount => {
        //   console.log(discount.entitled_product_ids);
        //  });
        discounts = elements;
    });

    await shopify.asset.update(id, {
        key: "assets/product.js",
        value: "document.addEventListener('uploaded', function(event) { document.getElementById('allData').setAttribute('discounts', '" + JSON.stringify(discounts) + "');  document.getElementById('allData').setAttribute('products', '" + JSON.stringify(products) + "'); let  cusEve = new CustomEvent('added'); document.dispatchEvent(cusEve); });"
    });


    res.send(products);
});
app.listen(3000, function () { return console.log("listening on 3000"); });
module.exports = app;
