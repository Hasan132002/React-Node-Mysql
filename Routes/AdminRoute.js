import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";

const router = express.Router();
const corsOptions = {
  origin: ["http://localhost:5173"],
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

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ Status: true });
});

export { router as adminRouter };
