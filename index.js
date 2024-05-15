require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:7001",
      "http://localhost:3000",
      "https://checkout.stripe.com",
    ],
  })
);

// checkout api
app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.title,
        images: [product.img],
      },

      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/sucess",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.json({ id: session.id });
});

app.listen(7001, () => {
  console.log("server start");
});
