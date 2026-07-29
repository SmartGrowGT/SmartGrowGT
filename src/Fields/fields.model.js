import { Schema, model } from 'mongoose';

const fieldSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la parcela es obligatorio'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'La ubicación o coordenadas son necesarias']
    },
    area: {
        type: Number, // Sera medido en metros cuadrados o hectareas
        required: true
    },
    // --- RELACIONES ---
    user: {
        type: String,
        required: true
    },
    crop: {
        type: Schema.Types.ObjectId,
        ref: 'Crop',
        required: true
    },

    deviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Device',
        default: null // Identificador del dispositivo Raspberry (Se asignara despues)
    },

    isActive: {
        type: Boolean,
        default: true
    },

    // --- Parametros Tecnicos del suelo ---
    // Estos datos son los que ingresa el usuario para calcular el riego
    soilData: {
        cc: {
            type: Number,
            description: 'Capacidad de Campo: Contenido de agua tras drenaje gravitacional (%)'
        },
        pmp: {
            type: Number,
            description: 'Punto de Marchitez Permanente: Humedad mínima antes de que la planta muera (%)'
        },
        zr: {
            type: Number,
            description: 'Zona Radicular: Profundidad de las raíces (cm)'
        },
        ur: {
            type: Number,
            description: 'Umbral de Riego: Límite de humedad para iniciar el riego (%)'
        },
        dap: {
            type: Number,
            description: 'Densidad Aparente: Masa de suelo seco por unidad de volumen (g/cm³)'
        },
        ib: {
            type: Number,
            description: 'Infiltración Básica: Velocidad de absorción de agua (mm/h)'
        },
        qest: {
            type: Number,
            description: 'Caudal Estable: Flujo de agua constante en el sistema (L/s)'
        }
    },
    // --- Análisis de Suelo / Datos Nutricionales ---
    // Estos datos representan el estado actual de los nutrientes en el terreno
    soilAnalysis: {
        nitrogen: {
            type: Number,
            description: 'Nivel de Nitrógeno (N) actual en el suelo',
            default: 0
        },
        phosphorus: {
            type: Number,
            description: 'Nivel de Fósforo (P) actual en el suelo',
            default: 0
        },
        potassium: {
            type: Number,
            description: 'Nivel de Potasio (K) actual en el suelo',
            default: 0
        },
        pH: {
            type: Number,
            description: 'Nivel de pH actual del suelo',
            default: 7
        }
    },
    healthStatus: {
        type: String,
        enum: ['Saludable', 'En Riesgo', 'Critico'],
        default: 'Saludable'
    },
    // --- Seguimiento Temporal ---
    plantingDate: {
        type: Date,
        default: Date.now // Fecha de siembra, por defecto al crear o cuando se configure
    },
    fertilizationPlan: {
        type: Object,
        default: null // Aquí se guardará el resultado estructurado de la IA
    }
}, {
    timestamps: true
});

export default model('Field', fieldSchema);