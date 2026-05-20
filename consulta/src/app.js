const express = require('express');
const consultaRoutes = require('./routes/consultaRoutes');

const app = express();

app.use(express.json());

app.use('/api', consultaRoutes);

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
