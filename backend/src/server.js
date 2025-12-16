import express from 'express'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import cors from 'cors'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT||5005
const allowedOrigin = 'http://localhost:5173';


app.use(express.json())

app.use(cors({
    orign: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
    //console.log('jwt secret loaded:', !!process.env.JWT_SECRET)
})