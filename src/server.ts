import app from "./app";
import prisma from "./database/prismaClient";
import { env } from "./config/env";

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

