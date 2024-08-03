import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    sellerRegister,
    sellerLogIn
} from '../controllers/sellerController.js';
import {
    productCreate,
    getProducts,
    getProductDetail,
    searchProductbyCategory,
    searchProduct,
    searchProductbySubCategory,
    getSellerProducts,
    updateProduct,
    deleteProduct,
    deleteProducts,
    deleteProductReview,
    deleteAllProductReviews,
    addReview,
    getInterestedCustomers,
    getAddedToCartProducts,
} from '../controllers/productController.js';
import {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate
} from '../controllers/customerController.js';
import {
    newOrder,
    getOrderedProductsBySeller
} from '../controllers/orderController.js';

const router = Router();

// Public routes (accessible without authentication)
router.post('/SellerRegister', sellerRegister);
router.post('/SellerLogin', sellerLogIn);
router.post('/CustomerRegister', customerRegister);
router.post('/CustomerLogin', customerLogIn);

router.get('/getProducts', getProducts);
router.get('/getProductDetail/:id', getProductDetail);
router.get('/getSellerProducts/:id', getSellerProducts);
router.get('/getInterestedCustomers/:id', getInterestedCustomers);
router.get('/getAddedToCartProducts/:id', getAddedToCartProducts);

router.get('/searchProduct/:key', searchProduct);      // replaced searchProductbyCategory to searchProduct
router.get('/searchProductbyCategory/:key', searchProductbyCategory);
router.get('/searchProductbySubCategory/:key', searchProductbySubCategory);    //replaced searchProductbyCategory to searchProductbySubCategory

// Apply authMiddleware to protect routes below this line
router.use(authMiddleware);

// Protected routes
router.put('/ProductUpdate/:id', updateProduct);
router.post('/addReview/:id', addReview);

router.delete('/DeleteProduct/:id', deleteProduct);
router.delete('/DeleteProducts/:id', deleteProducts);
router.delete('/deleteProductReview/:id', deleteProductReview);
router.put('/deleteAllProductReviews/:id', deleteAllProductReviews);

router.get('/getCartDetail/:id', getCartDetail);
router.put('/CustomerUpdate/:id', cartUpdate);

router.post('/newOrder', newOrder);
router.get('/getOrderedProductsBySeller/:id', getOrderedProductsBySeller);

// Create product route (protected for sellers)
router.post('/products', productCreate);

export default router;
