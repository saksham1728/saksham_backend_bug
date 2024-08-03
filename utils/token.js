import jwt from 'jsonwebtoken'; // Import jwt using ES module syntax

export const createNewToken = (payload) => {
    return jwt.sign({ userId: payload }, process.env.SECRET_KEY, { expiresIn: '10d' }); // Correctly use 'process.env.JWT_SECRET_KEY'
};
