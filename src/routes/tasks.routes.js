import { Router } from "express";
import {authRequired } from '../middlewares/validateToken.js';
import {getTask,getTasks,createTask,deleteTask, updateTask} from '../controllers/tasks.controller.js';
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schemas.js";

const router = Router()

router.get('/tasks', authRequired, getTasks ); //1

router.get('/tasks/:id', authRequired, getTask); //2

router.post('/tasks', authRequired, createTask ); //3

router.delete('/tasks/:id', authRequired, deleteTask); //4

router.put('/tasks/:id', authRequired, updateTask ); //5

export default router;