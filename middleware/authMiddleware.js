import jwt from 'jsonwebtoken'; // Import jwt using ES module syntax

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; // Access 'Authorization' from headers

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    const token = authHeader.split(' ')[1]; // Split to get the token part

    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use the correct secret key 

        //in .env file i have used "JWT_SECRET_KEY" to write my secret key 
        
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware; // Export the middleware using ES module syntax
