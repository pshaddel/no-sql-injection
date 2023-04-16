import { MongoClient } from "mongodb";
import { Router } from "express";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "raw-mongodb";

export const userMongoDBRouter = Router();

userMongoDBRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("users");
  const user = await collection.findOne({ email, password });
  if (!user) {
    res.status(401).send("Invalid credentials");
    return;
  } else {
    res.json({ message: "Login successful" });
  }
});

userMongoDBRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("users");
  const user = await collection.insertOne({
    email,
    password
  });
  res.json({ message: "User created", user });
});
