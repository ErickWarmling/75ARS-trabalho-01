const appEl = document.getElementById('app');
const navEl = document.getElementById('nav');

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR');
}

function toLocalInputValue(iso) {
  const date = iso ? new Date(iso) : new Date();
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderNav(active) {
  navEl.innerHTML = `
    <a href="#/" class="${active === 'list' ? 'active' : ''}">Consultas</a>
    <a href="#/nova" class="${active === 'new' ? 'active' : ''}">Nova consulta</a>
  `;
}

function renderError(message, details) {
  const detalhes =
    details?.erros?.length > 0
      ? `<ul>${details.erros.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ul>`
      : details?.detalhes
        ? `<pre>${escapeHtml(details.detalhes)}</pre>`
        : '';
  return `<div class="alert alert-error">${escapeHtml(message)}${detalhes}</div>`;
}

async function renderList() {
  renderNav('list');
  appEl.innerHTML = '<p class="loading">Carregando consultas...</p>';

  try {
    const consultas = await api.listarConsultas();

    if (consultas.length === 0) {
      appEl.innerHTML = `
        <section class="card">
          <h2>Consultas</h2>
          <p class="empty">Nenhuma consulta cadastrada.</p>
          <div class="actions">
            <a class="btn btn-primary" href="#/nova">Cadastrar consulta</a>
          </div>
        </section>
      `;
      return;
    }

    appEl.innerHTML = `
      <section class="card">
        <h2>Consultas cadastradas</h2>
        <p class="muted">Clique em uma consulta para ver os detalhes.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Data/hora</th>
                <th>Motivo</th>
                <th>Veterinário</th>
                <th>Animal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${consultas
                .map(
                  (c) => `
                <tr>
                  <td>${c.id}</td>
                  <td>${formatDateTime(c.dataHora)}</td>
                  <td>${escapeHtml(c.motivo)}</td>
                  <td>${escapeHtml(c.veterinario)}</td>
                  <td>${escapeHtml(c.animal?.nome)}</td>
                  <td><a class="link" href="#/consulta/${c.id}">Ver</a></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
        <div class="actions">
          <a class="btn btn-primary" href="#/nova">Nova consulta</a>
        </div>
      </section>
    `;
  } catch (error) {
    appEl.innerHTML = `<section class="card">${renderError(error.message, error.data)}</section>`;
  }
}

async function renderDetail(id) {
  renderNav('list');
  appEl.innerHTML = '<p class="loading">Carregando consulta...</p>';

  try {
    const consulta = await api.buscarConsulta(id);

    appEl.innerHTML = `
      <section class="card">
        <h2>Consulta #${consulta.id}</h2>
        <dl class="detail-grid">
          <div class="detail-row">
            <dt>Data/hora</dt>
            <dd>${formatDateTime(consulta.dataHora)}</dd>
          </div>
          <div class="detail-row">
            <dt>Motivo</dt>
            <dd>${escapeHtml(consulta.motivo)}</dd>
          </div>
          <div class="detail-row">
            <dt>Observações</dt>
            <dd>${escapeHtml(consulta.observacoes || '—')}</dd>
          </div>
          <div class="detail-row">
            <dt>Veterinário</dt>
            <dd>${escapeHtml(consulta.veterinario)}</dd>
          </div>
          <div class="detail-row">
            <dt>Animal</dt>
            <dd>${escapeHtml(consulta.animal?.nome)} (id ${consulta.animal?.id})</dd>
          </div>
        </dl>
        <div class="actions">
          <a class="btn btn-secondary" href="#/">Voltar</a>
        </div>
      </section>
    `;
  } catch (error) {
    appEl.innerHTML = `
      <section class="card">
        ${renderError(error.message, error.data)}
        <div class="actions">
          <a class="btn btn-secondary" href="#/">Voltar</a>
        </div>
      </section>
    `;
  }
}

async function renderForm() {
  renderNav('new');
  appEl.innerHTML = '<p class="loading">Carregando formulário...</p>';

  try {
    const [animais, tutores] = await Promise.all([
      api.listarAnimais(),
      api.listarTutores(),
    ]);

    appEl.innerHTML = `
      <section class="card">
        <h2>Nova consulta</h2>
        <p class="muted">Todas as requisições passam pela API de consultas, que orquestra animal e tutor.</p>
        <form id="form-consulta">
          <h3>Dados da consulta</h3>
          <div class="grid">
            <div class="field">
              <label for="dataHora">Data e hora</label>
              <input type="datetime-local" id="dataHora" name="dataHora" required value="${toLocalInputValue()}" />
            </div>
            <div class="field">
              <label for="veterinario">Veterinário</label>
              <input type="text" id="veterinario" name="veterinario" required placeholder="Nome do veterinário" />
            </div>
            <div class="field">
              <label for="motivo">Motivo</label>
              <input type="text" id="motivo" name="motivo" required placeholder="Ex.: Vacinação" />
            </div>
          </div>
          <div class="field">
            <label for="observacoes">Observações</label>
            <textarea id="observacoes" name="observacoes" placeholder="Opcional"></textarea>
          </div>

          <div class="section">
            <h3>Animal</h3>
            <div class="radio-group">
              <label><input type="radio" name="modoAnimal" value="existente" /> Animal já cadastrado</label>
              <label><input type="radio" name="modoAnimal" value="novo" checked /> Cadastrar novo animal</label>
            </div>

            <div id="animal-existente" class="hidden">
              <div class="field">
                <label for="animalId">Selecione o animal</label>
                <select id="animalId" name="animalId">
                  <option value="">— Selecione —</option>
                  ${animais
                    .map(
                      (a) =>
                        `<option value="${a.id}">${escapeHtml(a.nome)} — ${escapeHtml(a.especie)} (tutor #${a.tutor?.id})</option>`
                    )
                    .join('')}
                </select>
              </div>
            </div>

            <div id="animal-novo">
              <div class="grid">
                <div class="field">
                  <label for="animalNome">Nome do animal</label>
                  <input type="text" id="animalNome" name="animalNome" />
                </div>
                <div class="field">
                  <label for="animalEspecie">Espécie</label>
                  <input type="text" id="animalEspecie" name="animalEspecie" />
                </div>
                <div class="field">
                  <label for="animalRaca">Raça</label>
                  <input type="text" id="animalRaca" name="animalRaca" />
                </div>
              </div>

              <h3>Tutor (dono)</h3>
              <div class="radio-group">
                <label><input type="radio" name="modoTutor" value="existente" /> Tutor já cadastrado</label>
                <label><input type="radio" name="modoTutor" value="novo" checked /> Cadastrar novo tutor</label>
              </div>

              <div id="tutor-existente" class="hidden">
                <div class="field">
                  <label for="tutorId">Selecione o tutor</label>
                  <select id="tutorId" name="tutorId">
                    <option value="">— Selecione —</option>
                    ${tutores
                      .map(
                        (t) =>
                          `<option value="${t.id}">${escapeHtml(t.nome)} — ${escapeHtml(t.email)}</option>`
                      )
                      .join('')}
                  </select>
                </div>
              </div>

              <div id="tutor-novo">
                <div class="grid">
                  <div class="field">
                    <label for="tutorNome">Nome do tutor</label>
                    <input type="text" id="tutorNome" name="tutorNome" />
                  </div>
                  <div class="field">
                    <label for="tutorTelefone">Telefone</label>
                    <input type="text" id="tutorTelefone" name="tutorTelefone" />
                  </div>
                  <div class="field">
                    <label for="tutorEmail">E-mail</label>
                    <input type="email" id="tutorEmail" name="tutorEmail" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="form-feedback"></div>
          <div class="actions">
            <button type="submit" class="btn btn-primary">Salvar consulta</button>
            <a class="btn btn-secondary" href="#/">Cancelar</a>
          </div>
        </form>
      </section>
    `;

    setupFormHandlers();
  } catch (error) {
    appEl.innerHTML = `<section class="card">${renderError(error.message, error.data)}</section>`;
  }
}

function setupFormHandlers() {
  const form = document.getElementById('form-consulta');
  const animalExistente = document.getElementById('animal-existente');
  const animalNovo = document.getElementById('animal-novo');
  const tutorExistente = document.getElementById('tutor-existente');
  const tutorNovo = document.getElementById('tutor-novo');

  document.querySelectorAll('input[name="modoAnimal"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const isExistente = radio.value === 'existente' && radio.checked;
      animalExistente.classList.toggle('hidden', !isExistente);
      animalNovo.classList.toggle('hidden', isExistente);
    });
  });

  document.querySelectorAll('input[name="modoTutor"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const isExistente = radio.value === 'existente' && radio.checked;
      tutorExistente.classList.toggle('hidden', !isExistente);
      tutorNovo.classList.toggle('hidden', isExistente);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const feedback = document.getElementById('form-feedback');
    feedback.innerHTML = '';

    try {
      const payload = buildPayload(new FormData(form));
      const consulta = await api.criarConsulta(payload);
      feedback.innerHTML = `<div class="alert alert-success">Consulta #${consulta.id} cadastrada com sucesso!</div>`;
      setTimeout(() => {
        window.location.hash = `#/consulta/${consulta.id}`;
      }, 800);
    } catch (error) {
      feedback.innerHTML = renderError(error.message, error.data);
    }
  });
}

function buildPayload(formData) {
  const dataHora = new Date(formData.get('dataHora')).toISOString();
  const modoAnimal = formData.get('modoAnimal');

  const payload = {
    dataHora,
    motivo: formData.get('motivo'),
    observacoes: formData.get('observacoes') || undefined,
    veterinario: formData.get('veterinario'),
    animal: {},
  };

  if (modoAnimal === 'existente') {
    const animalId = Number(formData.get('animalId'));
    if (!animalId) {
      throw new Error('Selecione um animal');
    }
    payload.animal = { id: animalId };
    return payload;
  }

  const animal = {
    nome: formData.get('animalNome'),
    especie: formData.get('animalEspecie'),
    raca: formData.get('animalRaca') || undefined,
    tutor: {},
  };

  const modoTutor = formData.get('modoTutor');
  if (modoTutor === 'existente') {
    const tutorId = Number(formData.get('tutorId'));
    if (!tutorId) {
      throw new Error('Selecione um tutor');
    }
    animal.tutor = { id: tutorId };
  } else {
    animal.tutor = {
      nome: formData.get('tutorNome'),
      telefone: formData.get('tutorTelefone'),
      email: formData.get('tutorEmail'),
    };
  }

  payload.animal = animal;
  return payload;
}

function router() {
  const hash = window.location.hash || '#/';
  const detailMatch = hash.match(/^#\/consulta\/(\d+)$/);

  if (hash === '#/nova') {
    renderForm();
  } else if (detailMatch) {
    renderDetail(detailMatch[1]);
  } else {
    renderList();
  }
}

window.addEventListener('hashchange', router);
router();
