import mongoose from 'mongoose'; // Import mongoose using ES module syntax

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Seller", // changed seller to Seller
    },
    shopName: {
        type: String,
        unique: true,
        required: true,
    },
});

export default mongoose.model("seller", sellerSchema); // Export the model using ES module syntax
