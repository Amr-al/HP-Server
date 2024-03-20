const express = require("express");
const Employee = require("../mongodb/models/employee");
const bcrypt = require("bcryptjs");
const app = express.Router();

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email);
  // console.log(password);
  try {
    // Check if an employee with the given email exists
    const employee = await Employee.findOne({ emails: { $in: [email] } });
    // console.log(employee);
    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successful login
    // You can generate a token or session here to authenticate the user in subsequent requests
    res.json({ message: "Logged in successfully", employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Create a new employee
app.post("/", async (req, res) => {
  try {
    // Generate a salt to use for hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new employee with the hashed password
    const employee = await Employee.create({
      name: req.body.name,
      emails: [req.body.email],
      password: hashedPassword,
      mobiles: [req.body.mobiles],
      company: req.body.company
    });

    res.status(201).json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

// Get all employees
app.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Get a specific employee by ID
app.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

app.put("/:id", async (req, res) => {
  try {
    // Check if a new password is provided
    if (req.body.password) {
      // Generate a salt to use for hashing
      const salt = await bcrypt.genSalt(10);

      // Hash the new password using the generated salt
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Update the employee with the hashed password
      req.body.password = hashedPassword;
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// Delete an employee by ID
app.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (employee) {
      res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

module.exports = app;