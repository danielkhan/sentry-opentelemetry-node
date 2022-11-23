const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://localhost?writeConcern=majority";
const client = new MongoClient(uri);

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    await client.connect({ useNewUrlParser: true });
    const database = client.db("voting");
    const votes = database.collection("votes");

    if (req.query.choice) {
      await votes.insertOne({ choice: req.query.choice });
    }
    const spaces = await votes.countDocuments({ choice: "spaces" });
    const tabs = await votes.countDocuments({ choice: "tabs" });
    throw new Error("Something went wrong here!");
    return res.json({ spaces, tabs });
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

module.exports = router;
