import bcrypt from 'bcrypt';
import Customer from '../models/customerSchema.js';
import { createNewToken } from '../utils/token.js';

// Register a new customer
export const customerRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const customer = new Customer({
            ...req.body,
            password: hashedPass
        });

        const existingCustomerByEmail = await Customer.findOne({ email: req.body.email });

        if (existingCustomerByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        let result = await customer.save();
        result.password = undefined;
        
        const token = createNewToken(result._id);
        result = {
            ...result._doc,
            token: token
        };

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Log in a customer
export const customerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let customer = await Customer.findOne({ email: req.body.email });
        if (!customer) {
            return res.status(404).json({ message: "User not found" });
        }

        const validated = await bcrypt.compare(req.body.password, customer.password);
        if (!validated) {
            return res.status(400).json({ message: "Invalid password" });
        }

        customer.password = undefined;
        const token = createNewToken(customer._id);

        customer = {
            ...customer._doc,
            token: token
        };

        res.status(200).json(customer);
    } else {
        res.status(400).json({ message: "Email and password are required" });
    }
};

// Get cart details for a customer
export const getCartDetail = async (req, res) => {
    try {
        let customer = await Customer.findById(req.params.id);
        if (customer) {
            res.status(200).json(customer.cartDetails);
        } else {
            res.status(404).json({ message: "No customer found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Update cart details for a customer
export const cartUpdate = async (req, res) => {
    try {
        let customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Update the cart details
        customer.cartDetails = req.body.cartDetails;

        // Save the updated customer
        await customer.save();

        res.status(200).json(customer.cartDetails);
    } catch (err) {
        res.status(500).json(err);
    }
};
