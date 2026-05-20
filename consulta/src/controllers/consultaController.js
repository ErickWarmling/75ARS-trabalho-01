const consultaService = require('../services/consultaService');

function validarCadastro(body) {
  const erros = [];

  if (!body.dataHora || Number.isNaN(Date.parse(body.dataHora))) {
    erros.push('dataHora é obrigatório e deve ser uma data válida');
  }
  if (!body.motivo || typeof body.motivo !== 'string') {
    erros.push('motivo é obrigatório');
  }
  if (!body.veterinario || typeof body.veterinario !== 'string') {
    erros.push('veterinario é obrigatório');
  }
  if (body.observacoes !== undefined && typeof body.observacoes !== 'string') {
    erros.push('observacoes deve ser uma string');
  }
  if (!body.animal || typeof body.animal !== 'object') {
    erros.push('animal é obrigatório');
  } else {
    if (!body.animal.nome || typeof body.animal.nome !== 'string') {
      erros.push('animal.nome é obrigatório');
    }
    if (!body.animal.especie || typeof body.animal.especie !== 'string') {
      erros.push('animal.especie é obrigatório');
    }
    if (!body.animal.tutor || typeof body.animal.tutor !== 'object') {
      erros.push('animal.tutor é obrigatório');
    } else {
      if (!body.animal.tutor.nome || typeof body.animal.tutor.nome !== 'string') {
        erros.push('animal.tutor.nome é obrigatório');
      }
      if (
        !body.animal.tutor.telefone ||
        typeof body.animal.tutor.telefone !== 'string'
      ) {
        erros.push('animal.tutor.telefone é obrigatório');
      }
      if (!body.animal.tutor.email || typeof body.animal.tutor.email !== 'string') {
        erros.push('animal.tutor.email é obrigatório');
      }
    }
  }

  return erros;
}

async function cadastrar(req, res, next) {
  try {
    const erros = validarCadastro(req.body);
    if (erros.length > 0) {
      return res.status(400).json({ mensagem: 'Dados inválidos', erros });
    }

    const consulta = await consultaService.criarConsulta({
      dataHora: req.body.dataHora,
      motivo: req.body.motivo,
      observacoes: req.body.observacoes,
      veterinario: req.body.veterinario,
      animal: req.body.animal,
    });

    return res.status(201).json(consulta);
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ mensagem: 'id inválido' });
    }

    const consulta = await consultaService.buscarConsultaPorId(id);
    if (!consulta) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada' });
    }

    return res.json(consulta);
  } catch (error) {
    next(error);
  }
}

module.exports = { cadastrar, buscarPorId };
