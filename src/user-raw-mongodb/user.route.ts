import { MongoClient } from "mongodb";
import { Router } from "express";
import { z } from "zod";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "raw-mongodb";

export const userMongoDBRouter = Router();

userMongoDBRouter.post("/login", async (req, res) => {
  const result = loginValidator.safeParse(req.body);
  if (!result.success) {
    return res.status(400).send("Invalid request");
  }
  const { email, password } = result.data;
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("users");
  const user = await collection.findOne({
    email,
    password: hashPassword(password)
  });
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
    password: hashPassword(password)
  });
  res.json({ message: "User created", user });
});

const hashPassword = (password: string) => {
  return password;
};

const loginValidator = z.object({
  email: z.string(),
  password: z.string()
});
