import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: true,
    },
    shippingData: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pinCode: {
            type: Number,
            required: true, // Made pinCode required
        },
        phoneNo: {
            type: Number,
            required: true,
        },
    },
    orderedProducts: [{
        productId: {                                    //Included Product id and set it to required :true
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true, // Changed to reference product by ID
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    paidAt: {
        type: Date,
        required: true,
    },
    productsQuantity: {
        type: Number,
        required: true,
        default: 0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,  // Changed default to 0 for more flexibility
    },
    orderStatus: {
        type: String,
        required: true,
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("order", orderSchema);
