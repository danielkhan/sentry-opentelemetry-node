const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost";
const client = new MongoClient(uri);
const opentelemetry = require("@opentelemetry/api");
const tracer = opentelemetry.trace.getTracer("details");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const parentSpan = tracer.startSpan("main");
  const ctx = opentelemetry.setSpan(opentelemetry.context.active(), parentSpan);

  try {
    const ctx = opentelemetry.setSpan(
      opentelemetry.context.active(),
      parentSpan
    );
    const connectSpan = tracer.startSpan("mongo-connect", undefined, ctx);
    await client.connect({ useNewUrlParser: true });
    connectSpan.end();
    const database = client.db("voting");
    const votes = database.collection("votes");

    if (req.query.choice) {
      const insertSpan = tracer.startSpan("mongo-insert", undefined, ctx);

      await votes.insertOne({ choice: req.query.choice });
      insertSpan.end();
    }
    const countSpan = tracer.startSpan("mongo-count", undefined, ctx);
    const spaces = await votes.countDocuments({ choice: "spaces" });
    const tabs = await votes.countDocuments({ choice: "tabs" });
    countSpan.end();
    parentSpan.end();
    return res.json({ spaces, tabs });
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

module.exports = router;
