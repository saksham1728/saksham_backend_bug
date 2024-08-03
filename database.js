//We use Import 
//We set up type:"module" in pacakge.json to run the es file 


import { connect, Schema, model } from 'mongoose';
import { config } from 'dotenv';
config();

//we created a dot env file with mongo url 


const mongoURL = process.env.MONGO_URL;

console.log(`
IEEE CS MUJ Breaking Bug - Database set up.

Setting up the database. This might take a moment.
Note: It worked if it ends with "Dummy data created!"
`)

// Connect to MongoDB
connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected...');
    createDummyData();  // Call function to create dummy data
  })
  .catch(err => console.log(err));

// Customer Schema
const customerSchema = new Schema({
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
    default: "Customer"
  },
  cartDetails: [{
    productName: {
      type: String
    },
    price: {
      mrp: {
        type: Number
      },
      cost: {
        type: Number
      },
      discountPercent: {
        type: Number
      }
    },
    subcategory: {
      type: String
    },
    productImage: {
      type: String
    },
    category: {
      type: String
    },
    description: {
      type: String
    },
    tagline: {
      type: String
    },
    quantity: {
      type: Number
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'seller'
    },
  }],
  shippingData: {
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
    phoneNo: {
      type: Number,
    },
  }
});

const Customer = model("customer", customerSchema);

// Order Schema
const orderSchema = new Schema({
  buyer: {
    type: Schema.ObjectId,
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
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  orderedProducts: [{
    productName: {
      type: String
    },
    price: {
      mrp: {
        type: Number
      },
      cost: {
        type: Number
      },
      discountPercent: {
        type: Number
      }
    },
    subcategory: {
      type: String
    },
    productImage: {
      type: String
    },
    category: {
      type: String
    },
    description: {
      type: String
    },
    tagline: {
      type: String
    },
    quantity: {
      type: Number
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'seller'
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
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = model("order", orderSchema);

// Product Schema
const productSchema = new Schema({
  productName: {
    type: String
  },
  price: {
    mrp: {
      type: Number
    },
    cost: {
      type: Number
    },
    discountPercent: {
      type: Number
    }
  },
  subcategory: {
    type: String
  },
  productImage: {
    type: String
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  tagline: {
    type: String
  },
  quantity: {
    type: Number,
    default: 1
  },
  reviews: [{
    rating: {
      type: Number,
    },
    comment: {
      type: String,
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "customer",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'seller'
  },
}, { timestamps: true });

const Product = model("product", productSchema);

// Seller Schema
const sellerSchema = new Schema({
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
    default: "Seller"
  },
  shopName: {
    type: String,
    unique: true,
    required: true
  }
});

const Seller = model("seller", sellerSchema);

// Function to create dummy data
async function createDummyData() {
  // Dummy Seller
  const seller = new Seller({
    name: "John's Shop",
    email: "john@example.com",
    password: "password123",
    shopName: "JohnsShop"
  });
  await seller.save();

  // Dummy Customer
  const customer = new Customer({
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    shippingData: {
      address: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      country: "USA",
      pinCode: 12345,
      phoneNo: 1234567890
    }
  });
  await customer.save();

  // Dummy Product
  const product = new Product({
    productName: "Sample Product",
    price: {
      mrp: 100,
      cost: 90,
      discountPercent: 10
    },
    subcategory: "Sample Subcategory",
    productImage: "sample.jpg",
    category: "Sample Category",
    description: "This is a sample product.",
    tagline: "Best product ever!",
    seller: seller._id
  });
  await product.save();

  // Dummy Order
  const order = new Order({
    buyer: customer._id,
    shippingData: customer.shippingData,
    orderedProducts: [{
      productName: product.productName,
      price: product.price,
      subcategory: product.subcategory,
      productImage: product.productImage,
      category: product.category,
      description: product.description,
      tagline: product.tagline,
      quantity: 1,
      seller: seller._id
    }],
    paymentInfo: {
      id: "payment123",
      status: "Paid"
    },
    paidAt: new Date(),
    productsQuantity: 1,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 90,
    orderStatus: "Processing"
  });
  await order.save();

  console.log('Dummy data created!');
}

export default { Customer, Order, Product, Seller };
