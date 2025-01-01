import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';

const router = express.Router();
const employeeFilePath = './data/employees.json'; // File to store employee data

// Helper function to read and write to the JSON file
const readJSONFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return [];
};

const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

router.post("/employee_login", (req, res) => {
    const employees = readJSONFile(employeeFilePath);
    const employee = employees.find(e => e.email === req.body.email);
    
    if (employee) {
        bcrypt.compare(req.body.password, employee.password, (err, response) => {
            if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });

            if (response) {
                const token = jwt.sign({ role: "employee", email: employee.email, id: employee.id }, "jwt_secret_key", { expiresIn: "1d" });
                console.log(employee);
                res.cookie('token', token);
                return res.json({ loginStatus: true, id: employee.id });
            } else {
                return res.json({ loginStatus: false, Error: "Wrong password" });
            }
        });
    } else {
        return res.json({ loginStatus: false, Error: "Wrong email" });
    }
});

router.get('/detail/:id', (req, res) => {
    const employees = readJSONFile(employeeFilePath);
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    
    if (employee) {
        return res.json({ Status: true, Result: employee });
    } else {
        return res.json({ Status: false, Error: "Employee not found" });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as EmployeeRouter };
