import { Router } from 'express';
import { chatWithAgronomist, getUserChats, getChatById } from './aiAssistant.controller.js';

const api = Router();

api.post('/chat', chatWithAgronomist);
api.get('/chats', getUserChats);
api.get('/chats/:id/:userId', getChatById);

export default api;
