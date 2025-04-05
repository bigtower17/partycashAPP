const PDFDocument = require('pdfkit');
const { formatDate, formatCurrency } = require('../utils/format');

function renderOperationsPDF(doc, operations) {
  doc.fontSize(18).text('Registro Operazioni', { align: 'center' }).moveDown();

  doc.fontSize(12);
  const headerY = doc.y;
  doc.text('ID', 40, headerY, { width: 30 });
  doc.text('Tipo', 70, headerY, { width: 60 });
  doc.text('Importo', 130, headerY, { width: 60 });
  doc.text('Descrizione', 190, headerY, { width: 170 });
  doc.text('Data', 360, headerY, { width: 110 });
  doc.text('Utente', 470, headerY, { width: 70 });
  doc.text('Location', 540, headerY, { width: 50 });
  doc.moveTo(40, headerY + 15).lineTo(590, headerY + 15).stroke();
  doc.moveDown(2);

  operations.forEach(op => {
    const y = doc.y;
    doc.fontSize(10);
    doc.text(op.id.toString(), 40, y, { width: 30 });
    doc.text(op.type || '-', 70, y, { width: 60 });
    doc.text(formatCurrency(op.amount), 130, y, { width: 60, align: 'right' });
    doc.text(op.description || '-', 190, y, { width: 170 });
    doc.text(formatDate(op.created_at), 360, y, { width: 110 });
    doc.text(op.user || '-', 470, y, { width: 70 });
    doc.text(op.location || '-', 540, y, { width: 50 });

    if (doc.y > 750) doc.addPage();
  });

  doc.end();
}

function renderLocationReportPDF(doc, locations) {
  doc.fontSize(18).text('Report Location', { align: 'center' }).moveDown();

  locations.forEach(loc => {
    doc.fontSize(14).text(loc.name).moveDown(0.2);
    doc.fontSize(10)
      .text(`Fondocassa iniziale: € ${loc.startingCash}`)
      .text(`Totale incassato: € ${loc.totalIncasso}`)
      .text(`Operazioni registrate: ${loc.operations.length}`)
      .moveDown(0.5);

    loc.operations.forEach(op => {
      doc.text(`- [${op.type}] €${formatCurrency(op.amount)} - ${op.description || '-'} (${formatDate(op.created_at)})`);
    });

    doc.moveDown();
    doc.moveTo(doc.x, doc.y).lineTo(570, doc.y).stroke().moveDown();
  });

  doc.end();
}

module.exports = {
  renderOperationsPDF,
  renderLocationReportPDF
};
