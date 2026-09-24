import { Request, Response, NextFunction } from "express";

type ErrorLike = { status?: number; message?: string; code?: string; type?: string };

/**
 * Converte erros conhecidos do Prisma em respostas HTTP do cliente.
 */
function prismaStatus(err: ErrorLike, method: string): { status: number; message: string } | null {
  switch (err.code) {
    case "P2002":
      return { status: 409, message: "Já existe um registro com esses dados." };
    case "P2025":
      return { status: 404, message: "Registro não encontrado." };
    case "P2003":
      return method === "DELETE"
        ? { status: 409, message: "O registro possui vínculos e não pode ser removido." }
        : { status: 400, message: "Registro relacionado não encontrado." };
    default:
      return null;
  }
}

export function errorHandler(err: ErrorLike, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  // JSON malformado no corpo da requisição
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON inválido no corpo da requisição." });
  }

  const prisma = prismaStatus(err, req.method);
  if (prisma) {
    return res.status(prisma.status).json({ message: prisma.message });
  }

  if (err.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error("Erro não tratado:", err);
  return res.status(500).json({ message: "Erro interno do servidor." });
}
