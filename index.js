const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;



const app = express();


//  middleware 
app.use(cors()); 0
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a3goieg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const categoriesCollection = client.db('furnob').collection('Categories');
        const categoriesProductCollection = client.db('furnob').collection('categoriesProduct');
        const ordersCollection = client.db('furnob').collection('orders');
        const usersCollection = client.db('furnob').collection('users');
        const wishListCollection = client.db('furnob').collection('wishList');
        const productsCollection = client.db('furnob').collection('products');

        // all category api
        app.get('/Categories', async (req, res) => {
            const query = {};
            const options = await categoriesCollection.find(query).toArray();
            res.send(options);
        })




        // all seller
        app.get('/allseller', async (req, res) => {
            const seller = { role: "seller" }
            const result = await usersCollection.find(seller).toArray();
            res.send(result);
        });
        // all buyers api
        app.get('/allbuyers', async (req, res) => {
            const buyer = { role: "user" }
            const result = await usersCollection.find(buyer).toArray();
            res.send(result);
        });





        // catepro api

        app.get('/categoriesProduct/:id', async (req, res) => {
            const params = req.params.id;
            console.log(params);
            const query = { id: params }


            const options = await categoriesProductCollection.find(query).toArray();
            res.send(options);

        })
        // get orders api
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            console.log(email);

            const query = { email: email };
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders);
        });


        // orders api
        app.post('/orders', async (req, res) => {
            const order = req.body

            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });
        // get users api
        app.get('/users', async (req, res) => {

            const query = {}
            const users = await usersCollection.find(query).toArray();
            res.send(users);


        })

        // users registered api
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });











        // add product api
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products);
            res.send(result);
        });

        // get product api
        app.get('/products', async (req, res) => {
            const email = req.query.email;

            const query = { email: email };
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });
        // ----------------api role:user
        app.get('/users/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isUser: user?.role === 'user' });
        });

        // role:seller
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        });


        // role:admin
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        // delete product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(filter);
            res.send(result);
        });

        app.delete('/allseller/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        });

        app.delete('/allbuyers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        });








    }
    finally {

    }
}
run().catch(console.log);





app.get('/', async (req, res) => {
    res.send('furnob server is running');
})

app.listen(port, () => console.log(`Furnob server is running on ${port}`));


// export the express api
module.export = app;