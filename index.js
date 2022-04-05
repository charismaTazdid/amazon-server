const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vyi6c.mongodb.net/amazonClone?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const productsCollection = client.db('amazonClone').collection('products');
    const ordersCollection = client.db('amazonClone').collection('orders');

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // productsCollection.insertMany(products)
        // .then(result => {
        //     console.log(result) 
        // })
        console.log(products)
    });

    app.get('/getProducts', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/product/:ProductKey', (req, res) => {
        productsCollection.find({ key: req.params.ProductKey })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/selectedProduct', (req, res)=> {
        const productKeys = req.body;
        productsCollection.find({ key: {$in : productKeys} })
        .toArray( (err, documents) => {
            res.send(documents)
        } )
    })




    //post order by a diffrant collection
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            console.log(result) 
            res.send(result)
        })
        console.log(order)
    });




    // client.close()
});



app.get('/', (req, res) => {
    res.send('helllooooo! why you came here?')
})
// app.listen(port, () => {
//     console.log(`I Am listening on port ${port}`)
// })
app.listen(process.env.PORT || port)