import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/indexRoutes";
import prisma from "./database/prismaClient";
import { env } from "./config/env";

const app: Application = express();

// Segurança e parsing
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configurável via variável de ambiente
const allowedOrigins = env.corsOrigin.split(",").map((origin) => origin.trim());
app.use(
  cors({
    origin: env.nodeEnv === "production" ? allowedOrigins : true,
    credentials: true,
  })
);

// Rate limiting global da API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas requisições. Tente novamente mais tarde." },
});
app.use("/api", globalLimiter);

// Rotas
app.use("/api", routes);

// 404 - rota não encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Tratamento de erros global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro capturado:", err);
  res.status(500).json({ message: "Erro interno do servidor" });
});

const PORT = env.port;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} recebido. Encerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
