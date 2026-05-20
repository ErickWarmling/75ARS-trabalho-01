const express = require('express');
const animalRoutes = require('./routes/animalRoutes');

const app = express();

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options(/.*/, (_req, res) => res.sendStatus(204));

app.use(express.json());

app.use('/api', animalRoutes);

app.use((err, _req, res, _next) => {
  if (err.status) {
    return res.status(err.status).json({
      mensagem: err.message,
      detalhes: err.details,
    });
  }

  console.error(err);
  return res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

module.exports = app;
