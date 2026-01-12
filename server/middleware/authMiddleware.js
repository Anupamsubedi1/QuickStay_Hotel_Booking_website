export const protect = async (req, res, next) => {
    const { userId } = req.auth(); // Assuming req.auth() is populated by some previous middleware

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    req.userId = userId;
    next();
};
