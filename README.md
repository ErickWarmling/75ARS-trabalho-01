# Trabalho 01 - 75ARS

Repositório destinado ao Trabalho 01 da disciplina de Arquitetura de Software (75ARS).

## Serviços

| Serviço     | Tecnologia   | Porta | Descrição                          |
|-------------|--------------|-------|------------------------------------|
| `tutor/`    | Spring Boot  | 8080  | Cadastro e gestão de tutores       |
| `animal/`   | Node.js      | 3000  | Cadastro e consulta de animais     |
| `consulta/` | Node.js      | 3001  | Cadastro e consulta de consultas   |
| Postgres    | PostgreSQL 16| 5432  | Banco compartilhado `75ARS`        |

## Subir tudo com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

Aguarde os containers ficarem saudáveis (`postgres`, `tutor`, `animal`, `consulta`).

### Exemplo de cadastro de animal

```bash
curl -X POST http://localhost:3000/api/animais ^
  -H "Content-Type: application/json" ^
  -d "{\"nome\":\"Rex\",\"especie\":\"Cao\",\"raca\":\"Labrador\",\"tutor\":{\"nome\":\"Joao Silva\",\"telefone\":\"11999999999\",\"email\":\"joao@email.com\"}}"
```

### Exemplo de consulta de animal

```bash
curl http://localhost:3000/api/animais/1
```

### Exemplo de cadastro de consulta

```bash
curl -X POST http://localhost:3001/api/consultas \
  -H "Content-Type: application/json" \
  -d '{"dataHora":"2026-05-19T14:30:00.000Z","motivo":"Vacinação anual","observacoes":"Animal saudável","veterinario":"Dra. Ana Silva","animal":{"nome":"Rex","especie":"Cao","raca":"Labrador","tutor":{"nome":"Joao Silva","telefone":"11999999999","email":"joao@email.com"}}}'
```

### Exemplo de consulta por id

```bash
curl http://localhost:3001/api/consultas/1
```

### Parar os serviços

```bash
docker compose down
```

Para remover também o volume do banco:

```bash
docker compose down -v
```

## Execução local (sem Docker)

1. Subir PostgreSQL com banco `75ARS` (usuário `postgres`, senha `admin`).
2. API de tutores: `cd tutor && ./mvnw spring-boot:run`
3. API de animais: `cd animal && npm install && npm start`
4. API de consultas: `cd consulta && npm install && npm start`

---

## Autores

**Desenvolvido por:** [Erick Augusto Warmling](https://github.com/ErickWarmling); [Lucas Gitirana](https://github.com/lucas-gitirana);
