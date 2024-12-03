// Middleware to check if user is authenticated 
export function isAuthenticated(req, res, next) { 
    if (req.session.user) { 
        return next(); 
    } else { 
        res.redirect('/login'); 
    }
}