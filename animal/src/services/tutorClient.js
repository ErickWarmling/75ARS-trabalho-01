const TUTOR_API_URL =
  process.env.TUTOR_API_URL || 'http://localhost:8080/api';

async function cadastrarTutor({ nome, telefone, email }) {
  const response = await fetch(`${TUTOR_API_URL}/tutores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, telefone, email }),
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error('Falha ao cadastrar tutor na API de tutores');
    error.status = response.status;
    error.details = body;
    throw error;
  }

  return response.json();
}

module.exports = { cadastrarTutor };
