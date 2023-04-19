import mongoose from "mongoose";
import { Router } from "express";
import { z } from "zod";
const url = "mongodb://localhost:27017";
const dbName = "mongoose";

export const userMongooseRouter = Router();

const loginValidator = z.strictObject({
  email: z.string().email(),
  password: z.string()
});
userMongooseRouter.post("/login", async (req, res) => {
  const result = loginValidator.safeParse(req.body);
  if (!result.success) {
    res.status(401).send("Invalid credentials");
    return;
  }
  await mongoose.connect(url, { dbName });
  const db = mongoose.connection;
  const collection = db.collection("users");
  // mongoose enable debug mode
  mongoose.set("debug", true);
  const user = await collection.findOne(result.data);
  if (!user) {
    res.status(401).send("Invalid credentials");
    return;
  } else {
    res.json({ message: "Login successful", user: user });
  }
});

userMongooseRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  await mongoose.connect(url, { dbName });
  const db = mongoose.connection;
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
