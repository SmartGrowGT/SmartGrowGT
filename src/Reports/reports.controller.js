import Reports from './reports.model.js';

// Obtener todos los reportes
export const getReports = async (req, res) => {
  try {

    const reports = await Reports.find()
      .populate('deviceId', 'name deviceId status')
      .populate('fieldId', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error al obtener los reportes',
      error: error.message
    });

  }
};


// Obtener reporte por ID
export const getReportById = async (req, res) => {

  try {

    const { id } = req.params;

    const report = await Reports.findById(id)
      .populate('deviceId', 'name deviceId status')
      .populate('fieldId', 'name location');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      })
    }

    res.status(200).json({
      success: true,
      data: report
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error al obtener el reporte',
      error: error.message
    })

  }

}


// Obtener reportes por campo
export const getReportsByField = async (req, res) => {

  try {

    const { fieldId } = req.params;

    const reports = await Reports.find({ fieldId })
      .populate('deviceId', 'name deviceId status')
      .populate('fieldId', 'name location');

    res.status(200).json({
      success: true,
      data: reports
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error al obtener los reportes por campo',
      error: error.message
    })

  }

}


// Obtener reportes por hardware
export const getReportsByHardware = async (req, res) => {

  try {

    const { deviceId } = req.params; // Cambiado de hardwareId a deviceId

    const reports = await Reports.find({ deviceId })
      .populate('deviceId', 'name deviceId status')
      .populate('fieldId', 'name location');

    res.status(200).json({
      success: true,
      data: reports
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error al obtener los reportes por hardware',
      error: error.message
    })

  }

}


// Obtener reportes malos
export const getBadReports = async (req, res) => {

  try {

    const reports = await Reports.find({ alertType: 'mal' })
      .populate('deviceId', 'name deviceId status')
      .populate('fieldId', 'name location');

    res.status(200).json({
      success: true,
      data: reports
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Error al obtener los reportes malos',
      error: error.message
    })

  }

}