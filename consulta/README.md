# API de Consultas

API Node.js para cadastro e consulta de consultas veterinárias. Utiliza o mesmo banco PostgreSQL da API de animais (`75ARS`) e delega o cadastro de animais à API de animais.

## Execução com Docker (recomendado)

Na raiz do repositório (`75ARS-trabalho-01`):

```bash
docker compose up --build
```

Serviços disponíveis:

| Serviço   | URL                          |
|-----------|------------------------------|
| Tutores   | http://localhost:8080/api    |
| Animais   | http://localhost:3000/api    |
| Consultas | http://localhost:3001/api    |
| Postgres  | localhost:5432 (banco 75ARS) |

## Execução local

### Pré-requisitos

- Node.js 18+
- PostgreSQL com o banco `75ARS` (mesma configuração das APIs `tutor` e `animal`)
- API de animais em execução (porta 3000)

### Configuração

```bash
cd consulta
npm install
cp .env.example .env
```

Variáveis de ambiente (`.env`):

| Variável         | Padrão                                              |
|------------------|-----------------------------------------------------|
| `PORT`           | `3001`                                              |
| `DATABASE_URL`   | `postgresql://postgres:admin@localhost:5432/75ARS` |
| `ANIMAL_API_URL` | `http://localhost:3000/api`                        |

```bash
npm start
```

## Endpoints

### GET `/api/consultas`

Lista todas as consultas cadastradas.

### GET `/api/animais`

Lista animais via API de animais (proxy).

### GET `/api/tutores`

Lista tutores via API de animais → API de tutores (proxy em cadeia).

### POST `/api/consultas`

Grava a consulta vinculando um animal existente (`animal.id`) ou cadastrando um novo animal na API de animais (que pode usar tutor existente ou novo).

**Request (animal e tutor novos):**

```json
{
  "dataHora": "2026-05-19T14:30:00.000Z",
  "motivo": "Vacinação anual",
  "observacoes": "Animal apresentou leve febre",
  "veterinario": "Dra. Ana Silva",
  "animal": {
    "nome": "Rex",
    "especie": "Cao",
    "raca": "Labrador",
    "tutor": {
      "nome": "Joao Silva",
      "telefone": "11999999999",
      "email": "joao@email.com"
    }
  }
}
```

**Request (animal existente):**

```json
{
  "dataHora": "2026-05-19T14:30:00.000Z",
  "motivo": "Retorno",
  "veterinario": "Dr. Carlos",
  "animal": { "id": 1 }
}
```

**Request (animal novo com tutor existente):**

```json
{
  "dataHora": "2026-05-19T14:30:00.000Z",
  "motivo": "Check-up",
  "veterinario": "Dra. Ana",
  "animal": {
    "nome": "Mimi",
    "especie": "Gato",
    "tutor": { "id": 1 }
  }
}
```

**Response (201):** consulta criada com `id` e dados do animal.

### GET `/api/consultas/:id`

**Response (200):**

```json
{
  "id": 1,
  "dataHora": "2026-05-19T14:30:00.000Z",
  "motivo": "Vacinação anual",
  "observacoes": "Animal apresentou leve febre",
  "veterinario": "Dra. Ana Silva",
  "animal": {
    "id": 1,
    "nome": "Rex"
  }
}
```

## Modelo de dados

Tabela `consulta` (mesmo banco `75ARS`):

| Coluna      | Tipo     |
|-------------|----------|
| id          | bigint   |
| data_hora   | datetime |
| motivo      | string   |
| observacoes | string   |
| veterinario | string   |
| id_animal   | bigint   | FK → `animal.id`
