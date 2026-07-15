import { GoogleGenAI } from '@google/genai';
import ChatSession from './aiAssistant.model.js';

export const getUserChats = async (req, res) => {
    try {
        const { userId } = req.query; // Se espera por query o body
        
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Se requiere userId' });
        }

        const chats = await ChatSession.find({ user: userId }).sort({ updatedAt: -1 }).select('title updatedAt');
        
        res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial de chats',
            error: error.message
        });
    }
};

export const getChatById = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const chat = await ChatSession.findOne({ _id: id, user: userId });
        
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat no encontrado' });
        }

        res.status(200).json({
            success: true,
            chat
        });
    } catch (error) {
        console.error("Error fetching chat by id:", error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el chat',
            error: error.message
        });
    }
}

export const chatWithAgronomist = async (req, res) => {
    try {
        const { message, chatId, userId } = req.body;

        if (!userId) {
             return res.status(400).json({ success: false, message: 'Se requiere userId' });
        }

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'El mensaje es requerido'
            });
        }

        let chat;
        let formattedHistory = [];
        
        if (chatId) {
            chat = await ChatSession.findOne({ _id: chatId, user: userId });
            if (!chat) return res.status(404).json({ success: false, message: 'Chat no encontrado' });
            
            // Reconstruir historial para Gemini basado en BD
            formattedHistory = chat.messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));
        } else {
            // Crear nuevo chat, generar un título corto basado en el primer mensaje
            const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
            chat = new ChatSession({
                user: userId,
                title,
                messages: []
            });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemPrompt = `Eres un Ingeniero Agrónomo experto, fitopatólogo y asesor técnico de la plataforma SmartGrow. 
Tu objetivo es ayudar al agricultor respondiendo a sus dudas sobre cultivos, plagas, enfermedades, riego y fertilización.
Usa un tono profesional, empático y directo. Da recomendaciones prácticas y seguras. 
Si el usuario pregunta algo no relacionado con agricultura, botánica o tecnología agrícola, dile amablemente que tu especialidad es el campo agronómico.
Mantén tus respuestas relativamente cortas y fáciles de leer en un chat.`;

        const chatSessionAI = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: 'Entendido. Estoy listo para ayudar como Ingeniero Agrónomo experto.' }] },
                ...formattedHistory,
                { role: 'user', parts: [{ text: message }] }
            ]
        });

        const reply = chatSessionAI.text;

        // Guardar en BD
        chat.messages.push({ role: 'user', text: message });
        chat.messages.push({ role: 'model', text: reply });
        await chat.save();

        res.status(200).json({
            success: true,
            chatId: chat._id,
            reply
        });

    } catch (error) {
        console.error("Error in AI Assistant:", error);
        res.status(500).json({
            success: false,
            message: 'Error al comunicarse con el Asistente AI',
            error: error.message
        });
    }
};
