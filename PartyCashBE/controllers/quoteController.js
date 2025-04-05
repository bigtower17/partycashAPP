const quoteService = require('../services/quoteService');

const createQuote = async (req, res) => {
  try {
    const { name, notes, amount } = req.body;
    const userId = req.user.id;
    const quote = await quoteService.createQuote({ userId, name, notes, amount });
    res.status(201).json({ message: 'Quote created', quoteId: quote.id });
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
};

const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, notes, amount } = req.body;
    const quote = await quoteService.updateQuote({ id, name, notes, amount });
    res.json({ message: 'Quote updated', quoteId: quote.id });
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
};

const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await quoteService.deleteQuote(id);
    res.json({ message: 'Quote deleted', quoteId: quote.id });
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
};

const payQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { locationId } = req.body;
    const userId = req.user.id;
    const result = await quoteService.payQuote({ id, userId, locationId });
    res.json({ message: 'Quote paid', ...result });
  } catch (err) {
    console.error(err.message);
    res.status(400).send(err.message);
  }
};

const getQuotes = async (_req, res) => {
  try {
    const quotes = await quoteService.getQuotes();
    res.json(quotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to load quotes');
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await quoteService.getQuoteById(req.params.id);
    res.json(quote);
  } catch (err) {
    console.error(err.message);
    res.status(404).send(err.message);
  }
};

module.exports = {
  createQuote,
  updateQuote,
  deleteQuote,
  payQuote,
  getQuotes,
  getQuoteById
};
