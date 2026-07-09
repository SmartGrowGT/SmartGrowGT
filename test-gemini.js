import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI, Type } from '@google/genai';

async function test() {
    try {
        console.log("Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                resumen_diagnostico: {
                    type: Type.OBJECT,
                    properties: {
                        evaluacion_suelo: { type: Type.STRING },
                        alerta_ph: { type: Type.STRING, nullable: true }
                    },
                    required: ["evaluacion_suelo", "alerta_ph"]
                },
                seleccion_fertilizantes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            nombre: { type: Type.STRING },
                            razon_seleccion: { type: Type.STRING }
                        },
                        required: ["id", "nombre", "razon_seleccion"]
                    }
                },
                cronograma_aplicacion: {
                    type: Type.OBJECT,
                    properties: {
                        total_ciclo_dias: { type: Type.NUMBER },
                        fases: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    nombre_fase: { type: Type.STRING },
                                    rango_dias: { type: Type.STRING },
                                    fertilizantes_a_aplicar: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                nombre: { type: Type.STRING },
                                                cantidad_kg_total_fase: { type: Type.NUMBER },
                                                cantidad_sacos_fase: { type: Type.NUMBER }
                                            },
                                            required: ["nombre", "cantidad_kg_total_fase", "cantidad_sacos_fase"]
                                        }
                                    },
                                    instrucciones_agronomicas: { type: Type.STRING }
                                },
                                required: ["nombre_fase", "rango_dias", "fertilizantes_a_aplicar", "instrucciones_agronomicas"]
                            }
                        }
                    },
                    required: ["total_ciclo_dias", "fases"]
                },
                configuracion_riego_sugerido: {
                    type: Type.OBJECT,
                    properties: {
                        lamina_disponible_mm: { type: Type.NUMBER },
                        frecuencia_estimada: { type: Type.STRING },
                        tiempo_riego_minutos_por_sesion: { type: Type.NUMBER }
                    },
                    required: ["lamina_disponible_mm", "frecuencia_estimada", "tiempo_riego_minutos_por_sesion"]
                }
            },
            required: ["resumen_diagnostico", "seleccion_fertilizantes", "cronograma_aplicacion", "configuracion_riego_sugerido"]
        };

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro',
            contents: "Hola, dame un JSON ficticio que cumpla con este formato.",
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });
        
        console.log("Success!");
    } catch(err) {
        console.error("API ERROR:", err);
    }
}

test();
