import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import fs from "fs";

// File paths to store data
const adminFilePath = './data/admins.json';
const categoryFilePath = './data/categories.json';
const employeeFilePath = './data/employees.json';

const router = express.Router();

// Helper function to read and write to the JSON files
const readJSONFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return [];
};

const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Admin Login
router.post("/adminlogin", (req, res) => {
    const admins = readJSONFile(adminFilePath);
    const admin = admins.find(a => a.email === req.body.email && bcrypt.compareSync(req.body.password, a.password));
    
    if (admin) {
        const token = jwt.sign({ role: "admin", email: admin.email, id: admin.id }, "jwt_secret_key", { expiresIn: "1d" });
        res.cookie('token', token);
        return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
});

// Get Categories
router.get('/category', (req, res) => {
    const categories = readJSONFile(categoryFilePath);
    return res.json({ Status: true, Result: categories });
});

// Add Category
router.post('/add_category', (req, res) => {
    const categories = readJSONFile(categoryFilePath);
    const newCategory = { name: req.body.category };
    categories.push(newCategory);
    writeJSONFile(categoryFilePath, categories);
    return res.json({ Status: true });
});

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Add Employee
router.post('/add_employee', upload.single('image'), (req, res) => {
    const employees = readJSONFile(employeeFilePath);
    
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.json({ Status: false, Error: "Hashing error" });

        const newEmployee = {
            name: req.body.name,
            email: req.body.email,
            password: hash,
            address: req.body.address,
            salary: req.body.salary,
            image: req.file.filename,
            category_id: req.body.category_id
        };

        employees.push(newEmployee);
        writeJSONFile(employeeFilePath, employees);

        return res.json({ Status: true });
    });
});

// Get Employees
router.get('/employee', (req, res) => {
    const employees = readJSONFile(employeeFilePath);
    return res.json({ Status: true, Result: employees });
});

// Get Employee by ID
router.get('/employee/:id', (req, res) => {
    const employees = readJSONFile(employeeFilePath);
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    
    if (employee) {
        return res.json({ Status: true, Result: employee });
    } else {
        return res.json({ Status: false, Error: "Employee not found" });
    }
});

// Edit Employee
router.put('/edit_employee/:id', (req, res) => {
    const employees = readJSONFile(employeeFilePath);
    const employeeIndex = employees.findIndex(e => e.id === parseInt(req.params.id));
    
    if (employeeIndex !== -1) {
        employees[employeeIndex] = {
            ...employees[employeeIndex],
            name: req.body.name,
            email: req.body.email,
            salary: req.body.salary,
            address: req.body.address,
            category_id: req.body.category_id
        };
        writeJSONFile(employeeFilePath, employees);
        return res.json({ Status: true });
    } else {
        return res.json({ Status: false, Error: "Employee not found" });
    }
});

// Delete Employee
router.delete('/delete_employee/:id', (req, res) => {
    const employees = readJSONFile(employeeFilePath);
    const updatedEmployees = employees.filter(e => e.id !== parseInt(req.params.id));

    if (updatedEmployees.length === employees.length) {
        return res.json({ Status: false, Error: "Employee not found" });
    } else {
        writeJSONFile(employeeFilePath, updatedEmployees);
        return res.json({ Status: true });
    }
});

// Admin Count
router.get('/admin_count', (req, res) => {
    const admins = readJSONFile(adminFilePath);
    return res.json({ Status: true, Result: admins.length });
});

// Employee Count
router.get('/employee_count', (req, res) => {
    const employees = readJSONFile(employeeFilePath);
    return res.json({ Status: true, Result: employees.length });
});

// Total Salary
router.get('/salary_count', (req, res) => {
    const employees = readJSONFile(employeeFilePath);
    const totalSalary = employees.reduce((acc, employee) => acc + employee.salary, 0);
    return res.json({ Status: true, Result: totalSalary });
});

// Admin Records
router.get('/admin_records', (req, res) => {
    const admins = readJSONFile(adminFilePath);
    return res.json({ Status: true, Result: admins });
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as adminRouter };
