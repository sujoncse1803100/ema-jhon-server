
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = 3001;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("welcome to ema-jhon")
    console.log('Hi');
})

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifk56.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const products = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
    const orders = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_ORDER}`);

    app.post('/addProduct', (req, res) => {
        const product = req.body;

        console.log(product);
        products.insertOne(product)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            })
    })

    //get all product from db....
    app.get('/products', (req, res) => {

        products.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // get specific product from db....
    app.get('/product/:key', (req, res) => {

        products.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // get some products from db....
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        products.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                console.log(documents);
                res.send(documents);
            })
    })


    app.post('/addOrder', (req, res) => {
        const orderDetails = req.body;

        console.log(orderDetails);
        orders.insertOne(orderDetails)
            .then(result => {
                console.log(result);
                res.send(result.acknowledged);
            })
    })


});



app.listen(port);