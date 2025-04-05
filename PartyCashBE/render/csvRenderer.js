const { createObjectCsvStringifier } = require('csv-writer');

function generateOperationsCSV(operations) {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'id', title: 'ID' },
      { id: 'type', title: 'Tipo' },
      { id: 'amount', title: 'Importo' },
      { id: 'description', title: 'Descrizione' },
      { id: 'created_at', title: 'Data' },
      { id: 'user', title: 'Utente' },
      { id: 'location', title: 'Location' },
    ]
  });

  const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(operations);
  return csv;
}

function generateLocationReportCSV(records) {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'location', title: 'Location' },
      { id: 'starting_cash', title: 'Fondocassa Iniziale' },
      { id: 'total_incasso', title: 'Totale Incassato' },
      { id: 'operations', title: 'N. Operazioni' },
    ]
  });

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
}

module.exports = {
  generateOperationsCSV,
  generateLocationReportCSV
};
