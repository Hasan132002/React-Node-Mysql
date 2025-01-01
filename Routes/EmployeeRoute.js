import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import cors from "cors";

const router = express.Router();
const corsOptions = {
  origin: ["https://react-node-mysql.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
router.use(cors(corsOptions));

const employeeFilePath = path.join("data", "employees.json");

// Helper function to read/write JSON data
const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeJSON = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Employee login
router.post("/employee_login", (req, res) => {
  const employees = readJSON(employeeFilePath);
  const employee = employees.find((e) => e.email === req.body.email);

  if (employee) {
    bcrypt.compare(req.body.password, employee.password, (err, response) => {
      if (response) {
        const token = jwt.sign(
          { role: "employee", email: employee.email, id: employee.id },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        return res.json({ loginStatus: true, id: employee.id });
      }
      return res.json({ loginStatus: false, Error: "Wrong Password" });
    });
  } else {
    return res.json({ loginStatus: false, Error: "Wrong email or password" });
  }
});

// Add employee
router.post("/add_employee", (req, res) => {
  const employees = readJSON(employeeFilePath);
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const newEmployee = {
      id: Date.now(),
      name: req.body.name,
      email: req.body.email,
      password: hash,
      address: req.body.address,
      salary: req.body.salary,
    };
    employees.push(newEmployee);
    writeJSON(employeeFilePath, employees);
    res.json({ Status: true });
  });
});

// Employee list
router.get("/employee", (req, res) => {
  const employees = readJSON(employeeFilePath);
  res.json({ Status: true, Result: employees });
});

// Employee details
router.get("/employee/:id", (req, res) => {
  const employees = readJSON(employeeFilePath);
  const employee = employees.find((e) => e.id === Number(req.params.id));
  res.json({ Status: true, Result: employee });
});

// Update employee
router.put("/edit_employee/:id", (req, res) => {
  const employees = readJSON(employeeFilePath);
  const index = employees.findIndex((e) => e.id === Number(req.params.id));

  if (index !== -1) {
    employees[index] = { ...employees[index], ...req.body };
    writeJSON(employeeFilePath, employees);
    res.json({ Status: true });
  } else {
    res.json({ Status: false, Error: "Employee not found" });
  }
});

// Delete employee
router.delete("/delete_employee/:id", (req, res) => {
  const employees = readJSON(employeeFilePath);
  const updatedEmployees = employees.filter((e) => e.id !== Number(req.params.id));
  writeJSON(employeeFilePath, updatedEmployees);
  res.json({ Status: true });
});

export { router as EmployeeRouter };
