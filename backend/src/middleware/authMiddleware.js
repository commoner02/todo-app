import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] 


    if(!token) {
        return res.status(401).json({error: 'access token required'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.userId = decoded.userId 
        next()   
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'access token expired' });
        }
        return res.status(403).json({ error: 'invalid access token' })
        
    }
    
}

export default authMiddleware