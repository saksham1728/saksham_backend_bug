import Product from "../models/productSchema.js";
import Customer from "../models/customerSchema.js";

//Since we are using ES types we use import we dont use require
//And then we Export All the functions using export before const 


export const productCreate = async (req, res) => {
    try {
        // Check if the user is a seller
        if (req.user.role !== 'Seller') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const product = new Product(req.body);
        let result = await product.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getProducts = async (req, res) => {
    try {
        let products = await Product.find().populate("seller", "shopName");
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        let products = await Product.find({ seller: req.params.id });
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getProductDetail = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
            .populate("seller", "shopName")
            .populate({
                path: "reviews.reviewer",
                model: "customer",
                select: "name"
            });

        if (product) {
            res.send(product);
        } else {
            res.send({ message: "No product found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

//To ensure that the owner of the product is only allowed to update the product we did some changes in updateProduct system

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id; // Get the user ID from req.user

        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the current user is the owner of the product
        if (product.seller.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied. You are not the owner of this product.' });
        }

        // Update the product if the user is the owner
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: req.body },
            { new: true }
        );

        res.send(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, comment, reviewer } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);

        const existingReview = product.reviews.find(review => review.reviewer.toString() === reviewer);

        if (existingReview) {
            return res.send({ message: "You have already submitted a review for this product." });
        }

        product.reviews.push({
            rating,
            comment,
            reviewer,
            date: new Date(),
        });

        const updatedProduct = await product.save();

        res.send(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const searchProduct = async (req, res) => {
    try {
        const key = req.params.key;

        let products = await Product.find({
            $or: [
                { productName: { $regex: key, $options: 'i' } },
                { category: { $regex: key, $options: 'i' } },
                { subcategory: { $regex: key, $options: 'i' } }
            ]
        }).populate("seller", "shopName");

        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const searchProductbyCategory = async (req, res) => {
    try {
        const key = req.params.key;

        let products = await Product.find({
            $or: [
                { category: { $regex: key, $options: 'i' } },
                { subcategory: { $regex: key, $options: 'i' }}       //Added Subcategory while searching in categories*
            ]
        }).populate("seller", "shopName");

        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const searchProductbySubCategory = async (req, res) => {
    try {
        const key = req.params.key;

        let products = await Product.find({
            $or: [
                { subcategory: { $regex: key, $options: 'i' } }
            ]
        }).populate("seller", "shopName");

        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        await Customer.updateMany(
            { "cartDetails._id": deletedProduct._id },
            { $pull: { cartDetails: { _id: deletedProduct._id } } }
        );

        res.send(deletedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteProducts = async (req, res) => {
    try {
        const deletionResult = await Product.deleteMany({ seller: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No products found to delete" });
            return;
        }

        const deletedProducts = await Product.find({ seller: req.params.id });

        await Customer.updateMany(
            { "cartDetails._id": { $in: deletedProducts.map(product => product._id) } },
            { $pull: { cartDetails: { _id: { $in: deletedProducts.map(product => product._id) } } } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteProductReview = async (req, res) => {
    try {
        const { reviewId } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);

        //if no product exist with that id then throw error

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedReviews = product.reviews.filter(review => review._id != reviewId);

        product.reviews = updatedReviews;

        const updatedProduct = await product.save();

        res.send(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteAllProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        //if no product exist with that id then throw error
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }


        product.reviews = [];

        const updatedProduct = await product.save();

        res.send(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getInterestedCustomers = async (req, res) => {
    try {
        const productId = req.params.id;

        const interestedCustomers = await Customer.find({
            'cartDetails._id': productId
        });

        const customerDetails = interestedCustomers.map(customer => {
            const cartItem = customer.cartDetails.find(item => item._id.toString() === productId);
            if (cartItem) {
                return {
                    customerName: customer.name,
                    customerID: customer._id,
                    quantity: cartItem.quantity,
                };
            }
            return null; // If cartItem is not found in this customer's cartDetails
        }).filter(item => item !== null); // Remove null values from the result

        if (customerDetails.length > 0) {
            res.send(customerDetails);
        } else {
            res.send({ message: 'No customers are interested in this product.' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getAddedToCartProducts = async (req, res) => {
    try {
        const sellerId = req.params.id;

        const customersWithSellerProduct = await Customer.find({
            'cartDetails.seller': sellerId
        });

        const productMap = new Map(); // Use a Map to aggregate products by ID
        customersWithSellerProduct.forEach(customer => {
            customer.cartDetails.forEach(cartItem => {
                if (cartItem.seller.toString() === sellerId) {
                    const productId = cartItem._id.toString();
                    if (productMap.has(productId)) {
                        // If product ID already exists, update the quantity
                        const existingProduct = productMap.get(productId);
                        existingProduct.quantity += cartItem.quantity;
                    } else {
                        // If product ID does not exist, add it to the Map
                        productMap.set(productId, {
                            productName: cartItem.productName,
                            quantity: cartItem.quantity,
                            category: cartItem.category,
                            subcategory: cartItem.subcategory,
                            productID: productId,
                        });
                    }
                }
            });
        });

        const productsInCart = Array.from(productMap.values());

        if (productsInCart.length > 0) {
            res.send(productsInCart);
        } else {
            res.send({ message: 'No products from this seller are added to cart by customers.' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};
