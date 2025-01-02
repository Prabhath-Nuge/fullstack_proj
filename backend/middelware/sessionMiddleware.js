export const sessionMiddleware = (req, res, next) => {
    res.locals.isLoggedIn = !!req.session.cus; // Check if session exists
    res.locals.user = req.session.cus; // Store user data if available
    next();
};
