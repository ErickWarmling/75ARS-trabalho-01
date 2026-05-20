const API_BASE = window.CONFIG?.consultaApi || 'http://localhost:3001/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.mensagem ||
      data?.message ||
      `Erro ${response.status} ao comunicar com a API`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

const api = {
  listarConsultas: () => request('/consultas'),
  buscarConsulta: (id) => request(`/consultas/${id}`),
  criarConsulta: (body) =>
    request('/consultas', { method: 'POST', body: JSON.stringify(body) }),
  listarAnimais: () => request('/animais'),
  listarTutores: () => request('/tutores'),
};
