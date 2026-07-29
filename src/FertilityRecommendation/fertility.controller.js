'use strict';

import Crop from '../Crops/crops.model.js';
import Fertilizer from '../Fertilizers/fertilizers.model.js';
import Field from '../Fields/fields.model.js';
import { GoogleGenAI, Type } from '@google/genai';

const UNIT_CONVERSIONS = {
    'm2': (val) => val / 10000,
    'hectareas': (val) => val,
    'cuerdas': (val) => val * 0.04375
};

export const calculateRecommendation = async (req, res) => {
    try {
        const {
            cropId,
            terrainArea,
            areaUnit,
            soilAnalysis,
            fertilizerIds
        } = req.body;

        // Validar datos de entrada
        if (!cropId || !terrainArea || !areaUnit || !soilAnalysis || !fertilizerIds) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos: cropId, terrainArea, areaUnit, soilAnalysis, fertilizerIds'
            });
        }

        // Convertir área a hectáreas
        const converter = UNIT_CONVERSIONS[areaUnit];
        if (!converter) {
            return res.status(400).json({
                success: false,
                message: 'Unidad de área no válida. Use: m2, hectareas, cuerdas'
            });
        }
        const areaHa = converter(terrainArea);

        // Obtener perfil ideal del cultivo
        const crop = await Crop.findById(cropId);
        if (!crop) {
            return res.status(404).json({ success: false, message: 'Cultivo no encontrado' });
        }

        if (!crop.idealNitrogen || !crop.idealPhosphorus || !crop.idealPotassium) {
            return res.status(400).json({
                success: false,
                message: 'El cultivo no tiene perfil de fertilidad configurado'
            });
        }

        // Calcular déficit de nutrientes (kg/Ha)
        const idealN = (crop.idealNitrogen.min + crop.idealNitrogen.max) / 2;
        const idealP = (crop.idealPhosphorus.min + crop.idealPhosphorus.max) / 2;
        const idealK = (crop.idealPotassium.min + crop.idealPotassium.max) / 2;

        const deficitN = Math.max(0, idealN - (soilAnalysis.nitrogen || 0));
        const deficitP = Math.max(0, idealP - (soilAnalysis.phosphorus || 0));
        const deficitK = Math.max(0, idealK - (soilAnalysis.potassium || 0));

        // Obtener fertilizantes disponibles
        const fertilizers = await Fertilizer.find({
            _id: { $in: fertilizerIds },
            isActive: true
        });

        if (fertilizers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron fertilizantes disponibles'
            });
        }

        // Calcular recomendaciones por fertilizante
        // Fórmula: Total_Aplicar = ((Ideal - Actual) / % Riqueza) × Área(Ha)
        const recommendations = fertilizers.map(fert => {
            const results = {};

            if (fert.nitrogenPercent > 0 && deficitN > 0) {
                results.nitrogen = {
                    kgTotal: Math.round(((deficitN) / (fert.nitrogenPercent / 100)) * areaHa * 100) / 100,
                    nutrient: 'Nitrógeno (N)',
                    deficit: deficitN
                };
            }
            if (fert.phosphorusPercent > 0 && deficitP > 0) {
                results.phosphorus = {
                    kgTotal: Math.round(((deficitP) / (fert.phosphorusPercent / 100)) * areaHa * 100) / 100,
                    nutrient: 'Fósforo (P)',
                    deficit: deficitP
                };
            }
            if (fert.potassiumPercent > 0 && deficitK > 0) {
                results.potassium = {
                    kgTotal: Math.round(((deficitK) / (fert.potassiumPercent / 100)) * areaHa * 100) / 100,
                    nutrient: 'Potasio (K)',
                    deficit: deficitK
                };
            }

            // Calcular sacos comerciales necesarios (el mayor valor)
            const maxKg = Math.max(
                results.nitrogen?.kgTotal || 0,
                results.phosphorus?.kgTotal || 0,
                results.potassium?.kgTotal || 0
            );

            const bagsNeeded = fert.presentationWeight > 0
                ? Math.ceil(maxKg / fert.presentationWeight)
                : 0;

            const recObj = {
                fertilizer: {
                    _id: fert._id,
                    name: fert.name,
                    brand: fert.brand,
                    grade: fert.grade
                },
                calculations: results,
                totalKg: maxKg,
                bagsNeeded,
                bagWeight: fert.presentationWeight
            };
            console.log("Calculated Rec:", JSON.stringify(recObj));
            return recObj;
        });

        // Advertencias de pH
        const warnings = [];
        if (crop.idealPH) {
            const pH = soilAnalysis.pH || 7;
            if (pH < crop.idealPH.min) {
                warnings.push(`⚠️ pH del suelo (${pH}) está por debajo del rango óptimo (${crop.idealPH.min}-${crop.idealPH.max}). Los nutrientes no serán absorbidos eficientemente.`);
            } else if (pH > crop.idealPH.max) {
                warnings.push(`⚠️ pH del suelo (${pH}) está por encima del rango óptimo (${crop.idealPH.min}-${crop.idealPH.max}). Considere corregir antes de fertilizar.`);
            }
        }

        // Orden de aplicación
        const applicationOrder = [
            { nutrient: 'Fósforo (P)', deficit: deficitP, priority: 1 },
            { nutrient: 'Potasio (K)', deficit: deficitK, priority: 2 },
            { nutrient: 'Nitrógeno (N)', deficit: deficitN, priority: 3 }
        ].filter(n => n.deficit > 0);

        // Filtrar fertilizantes que no aportan nada útil (totalKg = 0)
        // y ordenar de menor cantidad de sacos a mayor (los más eficientes primero)
        const usefulRecommendations = recommendations
            .filter(rec => rec.totalKg > 0)
            .sort((a, b) => a.bagsNeeded - b.bagsNeeded);

        res.status(200).json({
            success: true,
            data: {
                crop: { name: crop.name, _id: crop._id },
                terrain: { area: terrainArea, unit: areaUnit, areaHa },
                soilAnalysis,
                deficits: {
                    nitrogen: deficitN,
                    phosphorus: deficitP,
                    potassium: deficitK
                },
                recommendations: usefulRecommendations,
                applicationOrder,
                warnings
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al calcular la recomendación',
            error: error.message
        });
    }
};

export const calculateAIRecommendation = async (req, res) => {
    try {
        const { fieldId, fertilizerIds } = req.body;

        if (!fieldId || !fertilizerIds) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos: fieldId, fertilizerIds'
            });
        }

        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({ success: false, message: 'Parcela (Field) no encontrada' });
        }

        const crop = await Crop.findById(field.crop);
        if (!crop) {
            return res.status(404).json({ success: false, message: 'Cultivo asociado a la parcela no encontrado' });
        }

        const fertilizers = await Fertilizer.find({
            _id: { $in: fertilizerIds },
            isActive: true
        });

        if (fertilizers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron fertilizantes disponibles'
            });
        }

        // Calcular déficit de nutrientes (kg/Ha)
        let deficitN = 0, deficitP = 0, deficitK = 0;
        if (crop.idealNitrogen && crop.idealPhosphorus && crop.idealPotassium) {
            const idealN = (crop.idealNitrogen.min + crop.idealNitrogen.max) / 2;
            const idealP = (crop.idealPhosphorus.min + crop.idealPhosphorus.max) / 2;
            const idealK = (crop.idealPotassium.min + crop.idealPotassium.max) / 2;

            deficitN = Math.max(0, idealN - (field.soilAnalysis?.nitrogen || 0));
            deficitP = Math.max(0, idealP - (field.soilAnalysis?.phosphorus || 0));
            deficitK = Math.max(0, idealK - (field.soilAnalysis?.potassium || 0));
        }

        const deficits = {
            nitrógeno: deficitN,
            fósforo: deficitP,
            potasio: deficitK
        };

        const promptText = `
Asistente: Actúa como un Ingeniero Agrónomo experto en programación de fertirriego de alta precisión. Tu tarea es analizar los datos de entrada de un cultivo, el análisis de su suelo, las características físicas de riego y el catálogo de fertilizantes disponibles para generar un plan de recomendación innovador, eficiente y distribuido en el tiempo.

### REGLAS DE NEGOCIO AGRONÓMICO:
1. SELECCIÓN INTELIGENTE: No uses todos los fertilizantes provistos. Selecciona la combinación MÁS EFICIENTE (menor cantidad de sacos o mezclas menos complejas) que cubra los déficits de N, P y K.
2. DISTRIBUCIÓN TEMPORAL (CRONOGRAMA): Los cultivos absorben nutrientes en diferentes etapas. Debes dividir el total de fertilizantes a aplicar según los "growthDays" del cultivo en 3 fases:
   - Fase Inicial / Vegetativa (0% al 30% del ciclo): Alta demanda de Fósforo (P) para desarrollo de raíces y Nitrógeno (N) moderado.
   - Fase de Desarrollo / Floración (30% al 60% del ciclo): Equilibrio de N-P-K.
   - Fase de Producción / Llenado de Fruto (60% al 100% del ciclo): Alta demanda de Potasio (K) para el dulzor/tamaño y Nitrógeno (N) controlado. El Fósforo baja al mínimo.
3. ADVERTENCIAS DE PH: Si el pH está fuera de rango, indica qué fertilizantes de la lista son de reacción ácida o alcalina para ayudar a regularlo, o advierte la pérdida de eficiencia.
4. CÁLCULO DE RIEGO (INNOVACIÓN): Utiliza los datos de \`soilData\` (cc, pmp, zr, ur, dap, ib, qest) para calcular la lámina de riego óptima y estimar el tiempo de riego recomendado en minutos para el sistema.

### DATOS DE ENTRADA EN TIEMPO DE EJECUCIÓN:
- Crop (Cultivo objetivo e ideales): ${JSON.stringify(crop)}
- Field (Datos de la parcela del usuario, área, soilData y soilAnalysis): ${JSON.stringify(field)}
- Fertilizers (Catálogo disponible): ${JSON.stringify(fertilizers)}
- Deficits_Calculados_Ha: ${JSON.stringify(deficits)}
`;

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
            model: 'gemini-1.5-flash',
            contents: promptText,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });

        const jsonResult = JSON.parse(response.text);

        // Novedad: Guardar el plan de fertilización automáticamente en la parcela
        field.fertilizationPlan = jsonResult;
        await field.save();

        res.status(200).json({
            success: true,
            data: jsonResult
        });
    } catch (error) {
        let statusCode = 500;
        let userMessage = 'Error al generar recomendación con IA';

        if (error.status === 503) {
            statusCode = 503;
            userMessage = 'Los servidores de Inteligencia Artificial (Google Gemini) están experimentando alta demanda. Por favor, intenta nuevamente en un momento.';
        }

        res.status(statusCode).json({
            success: false,
            message: userMessage,
            error: error.message
        });
    }
};

