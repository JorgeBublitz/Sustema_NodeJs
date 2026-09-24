import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/indexRoutes";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";

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
  // Nos testes automatizados o limite atrapalharia a suíte
  skip: () => env.nodeEnv === "test",
});
app.use("/api", globalLimiter);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Rotas
app.use("/api", routes);

// 404 - rota não encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Tratamento de erros global (respeita err.status, ex.: AuthError 401/404)
app.use(errorHandler);

export default app;
