import User from '../models/User.js';

export const protect = async (req, res, next) => {
    const { userId } = req.auth(); //  FIX

    if (!userId) {
        return res
            .status(401)
            .json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(userId);
    req.user = user;
    next();
};
