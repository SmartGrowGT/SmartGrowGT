'use strict';

import SensorData from "./sensordata.model.js";
import Field from "../Fields/fields.model.js";
import AlertLog from "../AlertLogs/alertlog.model.js";
import Reports from "../Reports/reports.model.js";
import Device from "../Devices/devices.model.js"; // Importar Device para buscar por string ID

export const recordSensorData = async (req, res) => {
    try {
        const { deviceId: stringDeviceId, temperature, humidity, unitTemp, unitHum } = req.body;

        // 1. Buscar el dispositivo por su string ID (ej: "SG-XXXX")
        const device = await Device.findOne({ deviceId: stringDeviceId });

        if (!device) {
            return res.status(404).json({
                success: false,
                message: `No se encontró un dispositivo con el ID: ${stringDeviceId}. Asegúrate de que el dispositivo esté registrado.`
            });
        }

        const deviceObjectId = device._id;

        // 1.5 Verificar si el dispositivo está online
        if (device.status !== 'online') {
            return res.status(403).json({
                success: false,
                message: `El dispositivo ${stringDeviceId} está offline. Debe estar online para registrar datos.`
            });
        }

        // 2. Guardar los datos del sensor usando el ObjectId
        const newSensorData = new SensorData({
            deviceId: deviceObjectId,
            temperature,
            humidity,
            unitTemp,
            unitHum
        });
        await newSensorData.save();

        // 3. Buscar la parcela asociada al deviceObjectId
        const field = await Field.findOne({ deviceId: deviceObjectId }).populate('crop');

        if (!field) {
            return res.status(200).json({
                success: true,
                message: "Datos del sensor guardados, pero no se encontró una parcela vinculada a este dispositivo físico.",
                sensorData: newSensorData
            });
        }

        const fieldId = field._id; // Usar el ObjectId directamente

        const crop = field.crop;
        let alertDescription = "";
        let healthPoints = 0; // 0: bien, 1: un problema, 2: dos problemas

        // 3. Comparar con los límites del cultivo
        if (temperature > crop.maximiumTemperature) {
            alertDescription += `Temperatura alta: ${temperature}${unitTemp || 'C'} (Máx: ${crop.maximiumTemperature}C). `;
            healthPoints++;
        } else if (temperature < crop.minimumTemperature) {
            alertDescription += `Temperatura baja: ${temperature}${unitTemp || 'C'} (Min: ${crop.minimumTemperature}C). `;
            healthPoints++;
        }

        if (humidity > crop.maximumHumidity) {
            alertDescription += `Humedad alta: ${humidity}${unitHum || '%'} (Máx: ${crop.maximumHumidity}%). `;
            healthPoints++;
        } else if (humidity < crop.minimumHumidity) {
            alertDescription += `Humedad baja: ${humidity}${unitHum || '%'} (Min: ${crop.minimumHumidity}%). `;
            healthPoints++;
        }

        // 4. Generar Reporte (Siempre se genera como historial)
        const report = new Reports({
            deviceId: deviceObjectId,
            fieldId: fieldId,
            humidity,
            temperature,
            alertType: healthPoints > 0 ? 'mal' : 'bien'
        });
        await report.save();

        // 5. Lógica de Alerta / Health Status
        if (healthPoints > 0) {
            // Generar Alerta (Solo si hay problemas)
            const alert = new AlertLog({
                deviceId: deviceObjectId,
                fieldId: fieldId,
                humidity,
                temperature,
                description: alertDescription,
                alertType: 'bad'
            });
            await alert.save();

            // Actualizar Health Status
            field.healthStatus = healthPoints === 1 ? 'En Riesgo' : 'Critico';
        } else {
            // Actualizar Health Status a Saludable
            field.healthStatus = 'Saludable';
        }

        await field.save();

        return res.status(201).json({
            success: true,
            message: healthPoints > 0 ? "Alerta generada debido a condiciones fuera de rango." : "Datos procesados correctamente. Reporte generado.",
            healthStatus: field.healthStatus,
            sensorData: newSensorData
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error al procesar los datos del sensor",
            error: error.message
        });
    }
};
