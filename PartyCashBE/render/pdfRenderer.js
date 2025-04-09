const { formatDate, formatCurrency } = require('../utils/format')

// Mappa operazioni (solo label)
const operationStyleMap = {
  deposit: { label: 'Scarico Cassa' },
  withdrawal: { label: 'Pagamento Cassa Generale' },
  local_withdrawal: { label: 'Pagamento da Postazione' },
  deposit_virtual: { label: 'Entrata Virtuale' },
  starting_cash_assigned: { label: 'Fondocassa assegnato' },
  starting_cash_recovered: { label: 'Fondocassa recuperato' }
}

function renderOperationsPDF(doc, operations) {
  doc.fontSize(18).text('Registro Operazioni', { align: 'center' }).moveDown(1.5)

  // Header
  doc.font('Helvetica-Bold').fontSize(11)
  const tableTop = doc.y

  const columnPositions = {
    id: 40,
    type: 80,
    amount: 200,
    desc: 280,
    date: 480,
    user: 560,
    loc: 630
  }
 
  doc.text('ID', columnPositions.id, tableTop, { width: 30 })
  doc.text('Tipo', columnPositions.type, tableTop, { width: 100 })
  doc.text('Importo', columnPositions.amount, tableTop, { width: 70, align: 'right' })
  doc.text('Descrizione', columnPositions.desc, tableTop, { width: 180 })
  doc.text('Data', columnPositions.date, tableTop, { width: 80 })
  doc.text('Utente', columnPositions.user, tableTop, { width: 60 })
  doc.text('Postazione', columnPositions.loc, tableTop, { width: 100 })

  doc.moveTo(40, doc.y + 12).lineTo(780, doc.y + 12).stroke()
  doc.moveDown()

  // Body
  doc.font('Helvetica').fontSize(10)

  operations.forEach(op => {
    const y = doc.y
    const style = operationStyleMap[op.type] || { label: op.type }

    doc.text(op.id.toString(), columnPositions.id, y, { width: 30 })
    doc.text(style.label, columnPositions.type, y, { width: 100 })
    doc.text(formatCurrency(op.amount), columnPositions.amount, y, { width: 70, align: 'right' })
    doc.text(op.description || '-', columnPositions.desc, y, { width: 180 })
    doc.text(formatDate(op.created_at), columnPositions.date, y, { width: 80 })
    doc.text(op.user || '-', columnPositions.user, y, { width: 60 })
    doc.text(op.location || '-', columnPositions.loc, y, { width: 100 })

    doc.moveDown(0.6)

    if (doc.y > 540) {  // spazio verticale disponibile in landscape
      doc.addPage({ layout: 'landscape' })
      doc.font('Helvetica').fontSize(10)
    }
  })
}

function renderLocationReportPDF(doc, locations) {
  doc.fontSize(18).text('Report Location', { align: 'center' }).moveDown()

  locations.forEach(loc => {
    doc.fontSize(14).text(loc.name).moveDown(0.2)
    doc.fontSize(10)
      .text(`Fondocassa iniziale: € ${loc.startingCash}`)
      .text(`Totale incassato: € ${loc.totalIncasso}`)
      .text(`Operazioni registrate: ${loc.operations.length}`)
      .moveDown(0.5)

    loc.operations.forEach(op => {
      const label = operationStyleMap[op.type]?.label || op.type
      doc.text(`- [${label}] €${formatCurrency(op.amount)} - ${op.description || '-'} (${formatDate(op.created_at)})`)
    })

    doc.moveDown()
    doc.moveTo(doc.x, doc.y).lineTo(780, doc.y).stroke().moveDown()
  })
}

module.exports = {
  renderOperationsPDF,
  renderLocationReportPDF
}
