import AlertLog from './alertlog.model.js';

// Obtener todas las alertas
export const getAlerts = async (req,res)=>{

    try{

        const alerts = await AlertLog.find().sort({createdAt:-1})

        res.status(200).json({
            success:true,
            data:alerts
        })

    }catch(error){

        res.status(500).json({
            success:false,
            message:'Error al obtener las alertas',
            error:error.message
        })

    }

}


// Obtener alerta por ID
export const getAlertById = async (req,res)=>{

    try{

        const {id} = req.params

        const alert = await AlertLog.findById(id)

        if(!alert){
            return res.status(404).json({
                success:false,
                message:'Alerta no encontrada'
            })
        }

        res.status(200).json({
            success:true,
            data:alert
        })

    }catch(error){

        res.status(500).json({
            success:false,
            message:'Error al obtener la alerta',
            error:error.message
        })

    }

}


// Obtener alertas por hardware
export const getAlertsByHardware = async (req,res)=>{

    try{

        const {hardwareId} = req.params

        const alerts = await AlertLog.find({hardwareId})

        res.status(200).json({
            success:true,
            data:alerts
        })

    }catch(error){

        res.status(500).json({
            success:false,
            message:'Error al obtener alertas por hardware',
            error:error.message
        })

    }

}


// Obtener alertas por campo
export const getAlertsByField = async (req,res)=>{

    try{

        const {fieldId} = req.params

        const alerts = await AlertLog.find({fieldId})

        res.status(200).json({
            success:true,
            data:alerts
        })

    }catch(error){

        res.status(500).json({
            success:false,
            message:'Error al obtener alertas por campo',
            error:error.message
        })

    }

}


// Obtener alertas malas
export const getBadAlerts = async (req,res)=>{

    try{

        const alerts = await AlertLog.find({alertType:'bad'})

        res.status(200).json({
            success:true,
            data:alerts
        })

    }catch(error){

        res.status(500).json({
            success:false,
            message:'Error al obtener alertas malas',
            error:error.message
        })

    }

}