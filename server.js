const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

/* MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* Home route */
app.get("/", (req, res) => {
  res.send("Employee API is running successfully");
});

/* GET employees */
app.get("/employees", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

/* POST employee */
app.post("/employees", async (req, res) => {
  const employee = new Employee(req.body);
  const saved = await employee.save();
  res.json(saved);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));