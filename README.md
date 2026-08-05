# 🏥 **Hospital Management API – Sustema**

API REST para gerenciamento de hospitais, construída com **Node.js**, **Express**, **Prisma ORM** e **PostgreSQL**.  
Permite cadastrar e gerenciar **usuários, médicos, enfermeiros, secretários, pacientes e agendamentos**.

> ⚠️ **Atenção:** este repositório contém dados sensíveis de pacientes e é **privado**. Não torne público sem autorização.

## 🚀 **Tecnologias**

- **Node.js**
- **Express** 5
- **Prisma** (PostgreSQL)
- **Helmet** + **Express Rate Limit** (segurança)

## ⚡ **Funcionalidades**

- CRUD de **usuários** (ADMIN, SECRETARY, DOCTOR, NURSE) — senha **hasheada** com bcrypt e **nunca retornada** pela API
- CRUD de **pacientes**
- CRUD de **consultas / agendamentos**
- Criação de **dados de exemplo** (seed)
- Relacionamentos entre **usuários, médicos, enfermeiros, secretários, pacientes e agendamentos**

## 🛠️ **Configuração**

1. **Clonar o projeto**
```bash
git clone https://github.com/JorgeBublitz/Sustema_NodeJs.git
cd Sustema_NodeJs
code .  // Para abrir o VSCode
```

2. **Instalar dependências**
```bash
npm install
```

3. **Configurar banco de dados**
```bash
cp .env.example .env
```

4. **Executar migrations**
```bash
npx prisma migrate dev --name init
```

## 🏃 **Executar a API**

```bash
npm run dev
```

A API estará disponível em [http://localhost:3000](http://localhost:3000).

## 🔧 **Configurações adicionais**

- **Mudar banco de dados:** altere a variável `DATABASE_URL` no `.env` e rode novamente:
```bash
npx prisma migrate dev
```

- **Reset do banco (apaga todos os dados):**
```bash
npx prisma migrate reset
```

- **Gerar / atualizar Prisma Client:**
```bash
npx prisma generate
```

## 📝 **Estrutura resumida**

- `/src` → código fonte
- `/src/controllers` → controladores da API
- `/src/services` → regras de negócio
- `/src/database` → configuração do Prisma
- `/prisma/schema.prisma` → modelo do banco de dados

## 💻 **Testando a API**

- `GET /api/user` → lista todos os usuários
- `POST /api/user` → cria um usuário (role, senha, etc.)
- `GET /api/pacient` → lista pacientes
- `POST /api/appointment` → cria agendamento

💡 Dica: use os exemplos do seed para testar imediatamente.

---

## 📝 **Licença**

MIT
