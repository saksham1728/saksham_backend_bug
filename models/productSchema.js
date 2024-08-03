import mongoose from 'mongoose'; // Import mongoose using ES module syntax

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
    },
    price: {
        mrp: {
            type: Number,
        },
        cost: {
            type: Number,
        },
        discountPercent: {
            type: Number,
        }
    },
    subcategory: {
        type: String,
    },
    productImage: {
        type: String,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
    tagline: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 0, // Default value for quantity
    },
    reviews: [
        {
            rating: {
                type: Number,
            },
            comment: {
                type: String,
            },
            reviewer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "customer", // Reference to the customer collection
                required:true,   //set required to true So that only authorized users can review the product 
            },
            date: {
                type: Date,
                default: Date.now, // Corrected default value for date
            },
        },
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seller", // Reference to the seller collection
    },
}, { timestamps: false }); // Explicitly setting timestamps to false

export default mongoose.model("product", productSchema); // Export the model using ES module syntax
