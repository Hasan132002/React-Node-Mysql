import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";

const router = express.Router();
const corsOptions = {
  origin: ["https://react-node-mysql.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
router.use(cors(corsOptions));

const adminFilePath = path.join("data", "admins.json");

// Helper function to read/write JSON data
const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeJSON = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Admin login
router.post("/adminlogin", (req, res) => {
  const admins = readJSON(adminFilePath);
  console.log(admins);
  const admin = admins.find(
    (a) => a.email === req.body.email && a.password === req.body.password
  );

  if (admin) {
    const token = jwt.sign(
      { role: "admin", email: admin.email, id: admin.id },
      "jwt_secret_key",
      { expiresIn: "1d" }
    );
    res.cookie("token", token);
    return res.json({ loginStatus: true });
  }
  return res.json({ loginStatus: false, Error: "Wrong email or password" });
});

// Admin records
router.get("/admin_records", (req, res) => {
  const admins = readJSON(adminFilePath);
  res.json({ Status: true, Result: admins });
});

// Admin count
router.get("/admin_count", (req, res) => {
  const admins = readJSON(adminFilePath);
  res.json({ Status: true, Count: admins.length });
});
router.post("/add_category", (req, res) => {
  const categories = readJSON(categoryFilePath);
  const newCategory = {
    id: categories.length + 1, // Simple ID generator
    name: req.body.category,
  };
  categories.push(newCategory);
  writeJSON(categoryFilePath, categories);
  res.json({ Status: true, Message: "Category added successfully" });
});

router.get("/category", (req, res) => {
  const categories = readJSON(categoryFilePath);
  res.json({ Status: true, Result: categories });
});

router.put("/update_category/:id", (req, res) => {
  const categories = readJSON(categoryFilePath);
  const categoryIndex = categories.findIndex((cat) => cat.id === parseInt(req.params.id));

  if (categoryIndex === -1) {
    return res.json({ Status: false, Error: "Category not found" });
  }

  categories[categoryIndex].name = req.body.category;
  writeJSON(categoryFilePath, categories);
  res.json({ Status: true, Message: "Category updated successfully" });
});
// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ Status: true });
});

export { router as adminRouter };
