const pool = require('../db');
const PDFDocument = require('pdfkit');
const { createObjectCsvStringifier } = require('csv-writer');

const exportOperationsCSV = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT o.id, o.type, o.amount::float AS amount, o.description, o.created_at,
               u.username AS user, l.name AS location
        FROM operations o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN location l ON o.location_id = l.id
        ORDER BY o.created_at DESC
      `);

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

        const records = result.rows.map(op => ({
            id: op.id,
            type: op.type,
            amount: Number(op.amount).toFixed(2),
            description: op.description || '',
            created_at: new Date(op.created_at).toLocaleString(),
            user: op.user || '',
            location: op.location || '',
        }));

        const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

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
        const result = await pool.query(`
      SELECT o.id, o.type, o.amount, o.description, o.created_at,
             u.username AS user, l.name AS location
      FROM operations o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN location l ON o.location_id = l.id
      ORDER BY o.created_at ASC
    `);

        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=operations.pdf');

        doc.pipe(res);

        // Titolo
        doc.fontSize(18).text('Registro Operazioni', { align: 'center' });
        doc.moveDown();

        // Intestazione tabella
        doc.fontSize(12);

        const headerY = doc.y; // ⬅️ Prendiamo la y iniziale fissa

        doc.text('ID', 40, headerY, { width: 30 });
        doc.text('Tipo', 70, headerY, { width: 60 });
        doc.text('Importo', 130, headerY, { width: 60 });
        doc.text('Descrizione', 190, headerY, { width: 170 });
        doc.text('Data', 360, headerY, { width: 110 });
        doc.text('Utente', 470, headerY, { width: 70 });
        doc.text('Location', 540, headerY, { width: 50 });

        doc.moveTo(40, headerY + 15).lineTo(590, headerY + 15).stroke(); // Riga sotto
        doc.moveDown(2); // Spazio prima di iniziare a scrivere le righe


        // Righe operazioni
        result.rows.forEach(op => {
            doc.fontSize(10);

            const amount = Number(op.amount);
            const formattedAmount = !isNaN(amount) ? amount.toFixed(2) : 'N/A';
            const formattedDate = op.created_at
                ? new Date(op.created_at).toLocaleString()
                : '-';

            const y = doc.y;

            doc.text(op.id.toString(), 40, y, { width: 30 });
            doc.text(op.type || '-', 70, y, { width: 60 });
            doc.text(formattedAmount, 130, y, { width: 60, align: 'right' });
            doc.text(op.description || '-', 190, y, { width: 170 });
            doc.text(formattedDate, 360, y, { width: 110 });
            doc.text(op.user || '-', 470, y, { width: 70 });
            doc.text(op.location || '-', 540, y, { width: 50 });

            if (doc.y > 750) {
                doc.addPage();
            }
        });

        doc.end();
    } catch (error) {
        console.error('Errore esportazione PDF:', error);
        res.status(500).send('Errore durante l\'esportazione PDF');
    }
};

const exportLocationReportCSV = async (req, res) => {
    try {
        const locations = await pool.query('SELECT id, name FROM location ORDER BY name');
        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'location', title: 'Location' },
                { id: 'starting_cash', title: 'Fondocassa Iniziale' },
                { id: 'total_incasso', title: 'Totale Incassato' },
                { id: 'operations', title: 'N. Operazioni' },
            ]
        });

        const records = [];

        for (const loc of locations.rows) {
            const { id: locationId, name: location } = loc;

            const startingCashResult = await pool.query(`
          SELECT SUM(amount) AS total FROM starting_cash WHERE location_id = $1
        `, [locationId]);

            const totalIncassoResult = await pool.query(`
          SELECT current_balance FROM location_budget WHERE location_id = $1
        `, [locationId]);

            const operationsResult = await pool.query(`
          SELECT COUNT(*) FROM operations WHERE location_id = $1
        `, [locationId]);

            records.push({
                location,
                starting_cash: Number(startingCashResult.rows[0].total || 0).toFixed(2),
                total_incasso: Number(totalIncassoResult.rows[0]?.current_balance || 0).toFixed(2),
                operations: operationsResult.rows[0].count
            });
        }

        const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

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
        const locations = await pool.query('SELECT id, name FROM location ORDER BY name');
        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=location_report.pdf');
        doc.pipe(res);

        doc.fontSize(18).text('Report Location', { align: 'center' }).moveDown();

        for (const loc of locations.rows) {
            const locationId = loc.id;

            const startingCash = await pool.query(`
          SELECT SUM(amount) AS total FROM starting_cash WHERE location_id = $1
        `, [locationId]);

            const totalIncasso = await pool.query(`
          SELECT current_balance FROM location_budget WHERE location_id = $1
        `, [locationId]);

            const operations = await pool.query(`
          SELECT type, amount, description, created_at
          FROM operations
          WHERE location_id = $1
          ORDER BY created_at ASC
        `, [locationId]);

            doc.fontSize(14).text(`${loc.name}`).moveDown(0.2);
            doc.fontSize(10)
                .text(`Fondocassa iniziale: € ${Number(startingCash.rows[0].total || 0).toFixed(2)}`)
                .text(`Totale incassato: € ${Number(totalIncasso.rows[0]?.current_balance || 0).toFixed(2)}`)
                .text(`Operazioni registrate: ${operations.rows.length}`)
                .moveDown(0.5);

            if (operations.rows.length > 0) {
                operations.rows.forEach(op => {
                    doc.text(`- [${op.type}] €${Number(op.amount).toFixed(2)} - ${op.description || '-'} (${new Date(op.created_at).toLocaleString()})`);
                });
            } else {
                doc.text('Nessuna operazione registrata.');
            }

            doc.moveDown();
            doc.moveTo(doc.x, doc.y).lineTo(570, doc.y).stroke().moveDown();
        }

        doc.end();
    } catch (error) {
        console.error('Errore esportazione report location PDF:', error);
        res.status(500).send("Errore durante l'esportazione PDF");
    }
};

module.exports = {
    exportOperationsCSV,
    exportOperationsPDF,
    exportLocationReportCSV,
    exportLocationReportPDF
};
