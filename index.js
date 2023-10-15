const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.iyzg5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("CoffeeDB");
    const coffee = database.collection("coffee");

    app.get('/coffee', async (req, res) => {
      const cursor = coffee.find();
      const reslut = await cursor.toArray();
      res.send(reslut)
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const quarry = { _id: new ObjectId(id) }
      const result = await coffee.findOne(quarry)
      res.send(result);
    })


    app.post('/coffee', async (req, res) => {
      const coffeeProduct = req.body;
      const result = await coffee.insertOne(coffeeProduct)
      res.send(result);
    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const coffeeUpdate = req.body;
      const options = { upsert: true };
      const updateCoffee = {
        $set: {
          name: coffeeUpdate.name,
          quentity: coffeeUpdate.quentity,
          supplier: coffeeUpdate.supplier,
          test: coffeeUpdate.test,
          category: coffeeUpdate.category,
          details: coffeeUpdate.details,
          photo: coffeeUpdate.photo
        },
      };

      const result = await coffee.updateOne(filter, updateCoffee, options)
      res.send(result)
      
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const quarry = { _id: new ObjectId(id) }
      const result = await coffee.deleteOne(quarry)
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Coffee Server is Ready')
})


app.listen(port, () => {
  console.log(`Successfully Run our server:${port}`)
})