import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sustema API",
      version: "1.2.0",
      description: `API REST para gerenciamento hospitalar (sistema de agenda/prontuário administrativo de um hospital), cobrindo os seguintes grupos de recursos:

- **Auth**: login (público) e leitura do perfil autenticado (/api/auth/me).
- **Users**: cadastro central de usuários do sistema, com criação automática do registro complementar (Doctor, Nurse ou Secretary) conforme o papel (role) escolhido.
- **Doctors**, **Nurses**, **Secretaries**: registros profissionais vinculados 1:1 a um usuário, com CRM/COREN, departamento, situação de trabalho, etc.
- **Patients**: cadastro de pacientes (dados pessoais, condição clínica e localização/departamento).
- **Appointments**: agendamentos/consultas, vinculando paciente, um ou mais médicos, opcionalmente enfermeiros e um secretário responsável.

**Autenticação**: todas as rotas, exceto POST /api/auth/login, exigem um token JWT no header \`Authorization: Bearer <token>\`, obtido em POST /api/auth/login. Use o botão **Authorize** desta página colando apenas o token (sem o prefixo "Bearer ").

**Autorização (RBAC)**: cada rota de escrita exige um ou mais papéis específicos (ADMIN, DOCTOR, NURSE, SECRETARY) verificados a partir do \`role\` do usuário autenticado — os detalhes de quem pode fazer o quê estão na descrição de cada grupo de rotas e de cada operação abaixo.`,
      contact: {
        name: "Jorge Luis Heringer Bublitz",
        email: "bublitzjorge3@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/docs/*.swagger.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
