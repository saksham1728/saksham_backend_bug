import bcrypt from 'bcrypt'; // Import bcrypt using ES module syntax
import Seller from '../models/sellerSchema.js'; // Import Seller model using ES module syntax
import {createNewToken} from '../utils/token.js'; // Import createNewToken using ES module syntax

export const sellerRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // Create a new seller instance with hashed password
        const seller = new Seller({
            ...req.body,
            password: hashedPass // Use hashed password instead of bcrypt.hash
        });

        // Check if seller with the same email or shop name already exists
        const existingSellerByEmail = await Seller.findOne({ email: req.body.email });
        const existingShop = await Seller.findOne({ shopName: req.body.shopName });

        if (existingSellerByEmail) {
            return res.send({ message: 'Email already exists' });
        } else if (existingShop) {
            return res.send({ message: 'Shop name already exists' });
        } else {
            let result = await seller.save();
            result.password = undefined; // Remove password from result

            const token = createNewToken(result._id);

            result = {
                ...result._doc,
                token: token
            };

            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err); // Return server error if something goes wrong
    }
};

export const sellerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let seller = await Seller.findOne({ email: req.body.email });
        if (seller) {
            const validated = await bcrypt.compare(req.body.password, seller.password);
            if (validated) {
                seller.password = undefined; // Remove password from result

                const token = createNewToken(seller._id);

                seller = {
                    ...seller._doc,
                    token: token // Correctly assign the token
                };

                res.send(seller);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};
