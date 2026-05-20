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

### POST `/api/consultas`

Cadastra o animal na API de animais e, em seguida, grava a consulta.

**Request:**

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

**Response (201):** consulta criada com `id` e dados do animal.

### GET `/api/consultas/:id`

**Response (200):**

```json
{
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
