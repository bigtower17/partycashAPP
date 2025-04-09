const PDFDocument = require('pdfkit');
const {
  fetchOperations,
  fetchLocationReportData,
  fetchLocationDetailsForPDF
} = require('../services/exportService');

const {
  generateOperationsCSV,
  generateLocationReportCSV
} = require('../render/csvRenderer');

const {
  renderOperationsPDF,
  renderLocationReportPDF
} = require('../render/pdfRenderer');

const exportOperationsCSV = async (req, res) => {
  try {
    const operations = await fetchOperations();
    const csv = generateOperationsCSV(operations);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=operations.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Errore esportazione CSV:', error);
    res.status(500).send("Errore durante l'esportazione CSV");
  }
};

const exportOperationsPDF = async (req, res) => {
  try {
    const operations = await fetchOperations()
    const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=operations.pdf')
    doc.pipe(res)

    renderOperationsPDF(doc, operations) // scrive il contenuto
    doc.end() // chiude lo stream dopo
  } catch (error) {
    console.error('Errore esportazione PDF:', error)
    res.status(500).send("Errore durante l'esportazione PDF")
  }
}


const exportLocationReportCSV = async (req, res) => {
  try {
    const records = await fetchLocationReportData();
    const csv = generateLocationReportCSV(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=location_report.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Errore esportazione report location CSV:', error);
    res.status(500).send("Errore durante l'esportazione");
  }
};

const exportLocationReportPDF = async (req, res) => {
  try {
    const locationData = await fetchLocationDetailsForPDF();
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=location_report.pdf');
    doc.pipe(res);

    renderLocationReportPDF(doc, locationData);
  } catch (error) {
    console.error('Errore esportazione report location PDF:', error);
    res.status(500).send("Errore durante l'esportazione PDF");
  }
};

const { generateSignedExportToken } = require('../utils/signedUrl');

const generateExportUrl = (req, res) => {
  const { report, type } = req.body;

  const allowedReports = ['operations', 'locations'];
  const allowedTypes = ['csv', 'pdf'];

  if (!allowedReports.includes(report) || !allowedTypes.includes(type)) {
    return res.status(400).json({ message: 'Tipo di report o formato non valido' });
  }

  const token = generateSignedExportToken({ report, type });
  const url = `${process.env.BASE_URL || 'https://partycash.me'}/api/export/${report}/${type}?token=${token}`;

  return res.json({ url });
};

module.exports = {
  exportOperationsCSV,
  exportOperationsPDF,
  exportLocationReportCSV,
  exportLocationReportPDF,
  generateExportUrl 
  
};
