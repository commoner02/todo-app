import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
    const token = req.headers['authorization']

    if(!token) {
        return res.send('no token provided')
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.json({message: 'invalid token'})
        }
        req.userId = decoded.id 
        next()
    })
}

export default authMiddleware