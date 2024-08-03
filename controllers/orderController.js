import Order from '../models/orderSchema.js'; // Import Order model using ES module syntax

export const newOrder = async (req, res) => {
    try {
        const {
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            productsQuantity,
            totalPrice,
            orderStatus, //Added the field orderStatus
        } = req.body;


         // Validate required fields
         if (!buyer || !shippingData || !orderedProducts || !paymentInfo || !productsQuantity || !totalPrice) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        // Create a new order and save it to the database
        const order = await Order.create({
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            paidAt: Date.now(),
            productsQuantity,
            totalPrice,
            orderStatus //Added the field orderStatus
        });

        return res.send(order);

    } catch (err) {
        res.status(500).json(err); // Return server error if something goes wrong
    }
};

export const getOrderedProductsByCustomer = async (req, res) => {
    try {
        // Find orders by customer ID
        let orders = await Order.find({ buyer: req.params.id });

        // Aggregate ordered products from all orders
        const orderedProducts = orders.reduce((accumulator, order) => {
            accumulator.push(...order.orderedProducts);
            return accumulator;
        }, []);

        // Return the ordered products if any are found
        if (orderedProducts.length > 0) {
            res.send(orderedProducts);
        } else {
            res.send({ message: "No products found. Check the filtering logic." });
        }
    } catch (err) {
        res.status(500).json(err); // Return server error if something goes wrong
    }
};

export const getOrderedProductsBySeller = async (req, res) => {
    try {
        const sellerId = req.params.id;

        // Find orders where the seller ID is in the ordered products
        const ordersWithSellerId = await Order.find({
            'orderedProducts.sellerId': sellerId
        });

        if (ordersWithSellerId.length > 0) {
            // Aggregate ordered products and merge quantities if they are the same
            const orderedProducts = ordersWithSellerId.reduce((accumulator, order) => {
                order.orderedProducts.forEach(product => {
                    const existingProductIndex = accumulator.findIndex(p => p._id.toString() === product._id.toString());
                    if (existingProductIndex !== -1) {
                        // If product already exists, merge quantities
                        accumulator[existingProductIndex].quantity += product.quantity;
                    } else {
                        // If product doesn't exist, add it to accumulator
                        accumulator.push(product);
                    }
                });
                return accumulator;
            }, []);
            res.send(orderedProducts);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err); // Return server error if something goes wrong
    }
};
