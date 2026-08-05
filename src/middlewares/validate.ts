import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

/**
 * Middleware de validação com Zod.
 * Valida `req.body` (ou `req.params`/`req.query` via `source`) e,
 * em caso de sucesso, substitui o valor original pelos dados parseados.
 */
export function validate<T>(
  schema: ZodType<T>,
  source: "body" | "params" | "query" = "body"
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensagem: issue.message,
      }));
      res.status(400).json({
        message: "Dados inválidos.",
        errors: issues,
      });
      return;
    }

    // Injeta os dados já validados/transformados de volta no request
    (req as unknown as Record<string, unknown>)[source] = result.data;
    next();
  };
}
