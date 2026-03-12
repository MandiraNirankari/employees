const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

/* MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* Product Schema */
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productCode: { type: String, required: true, unique: true },
  category: String,
  supplierName: { type: String, required: true },
  quantityInStock: { type: Number, min: 0 },
  reorderLevel: { type: Number, min: 1 },
  unitPrice: { type: Number, min: 0 },
  manufactureDate: Date,
  productType: { type: String, enum: ["Perishable", "Non-Perishable"] },
  status: { type: String, default: "Available" }
});

const Product = mongoose.model("Product", productSchema);

/* Home Route */
app.get("/", (req, res) => {
  res.send("Store Inventory API running successfully");
});

/* Add Product */
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* Get All Products */
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Search Product by Name */
app.get("/products/search", async (req, res) => {
  try {
    const products = await Product.find({
      productName: { $regex: req.query.name, $options: "i" }
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Filter by Category */
app.get("/products/category", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.query.cat
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Get Product by ID */
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Update Product */
app.put("/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* Delete Product */
app.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Server Start */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});