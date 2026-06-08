'use strict';

import Crop from '../Crops/crops.model.js';
import Fertilizer from '../Fertilizers/fertilizers.model.js';

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
