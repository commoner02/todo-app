import express from "express"
const router = express.Router()
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodo } from '../controllers/todoController.js'
import protect from '../middlewares/authMiddleware.js'

router.use(protect)

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.put('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

export default router

