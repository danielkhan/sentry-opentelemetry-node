const express = require("express");

const router = express.Router();
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost";
const client = new MongoClient(uri);
const opentelemetry = require("@opentelemetry/api");

const tracer = opentelemetry.trace.getTracer("details");

// Expensive Fibonacci function
function fibonacci(n) {
  if (n < 2) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

/* GET home page. */
router.get("/", async (req, res, next) => {
  await tracer.startActiveSpan("custom-instrumentation", async (parentSpan) => {
    try {
      // const connectSpan = tracer.startSpan("custom-mongo-connect");
      await client.connect({ useNewUrlParser: true });
      // connectSpan.end();

      const database = client.db("voting");
      const votes = database.collection("votes");

      // Randomly call the Fibonacci function
      if (Math.random() < 0.5) {
        // 50% chance
        const fiboSpan = tracer.startSpan("expensive-fibonacci");
        const fiboNumber = fibonacci(45); // for example, calculate the 10th Fibonacci number
        fiboSpan.end();
      }

      if (Math.random() < 0.8) {
        throw new Error("Something went wrong here!");
      }

      if (req.query.choice) {
        // const insertSpan = tracer.startSpan("custom-mongo-insert");
        await votes.insertOne({ choice: req.query.choice });
        // insertSpan.end();
      }

      // const countSpan = tracer.startSpan("custom-mongo-count");
      const spaces = await votes.countDocuments({ choice: "spaces" });
      const tabs = await votes.countDocuments({ choice: "tabs" });
      // countSpan.end();

      parentSpan.end();
      return res.json({
        spaces,
        tabs
      });
    } catch (err) {
      console.log(err);
      parentSpan.end();
      return next(err);
    }
  });
});

module.exports = router;
