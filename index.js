const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("camera_shop");
    const shopCollection = database.collection("products");
    const feedbackCollection = database.collection("feedbacks");

    // get api
    app.get("/products", async (req, res) => {
      const cursor = shopCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await shopCollection.insertOne(product);
      res.json(result);
    });

    app.post("/feedbacks", async (req, res) => {
      const feedback = req.body;
      const result = await feedbackCollection.insertOne(feedback);
      res.json(result);
    });
    app.get("/feedbacks", async (req, res) => {
      const cursor = feedbackCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello express");
});
app.listen(port, () => {
  console.log(`HELLO  server :${port}`);
});
