import { Request, Response, NextFunction } from "express";

/**
 * Contrato mínimo que um service precisa expor para o factory CRUD.
 */
// Os defaults `any` permitem que cada controller declare o service inline e o TS infira os tipos.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CrudService<T, CreateData = any, UpdateData = any> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(data: CreateData): Promise<T>;
  update(id: number, data: UpdateData): Promise<T>;
  delete(id: number): Promise<T>;
}

export interface CrudControllerOptions<T, CreateData, UpdateData> {
  service: CrudService<T, CreateData, UpdateData>;
  /** Nome do recurso usado nas mensagens (ex.: "Médico", "Enfermeiro(a)"). */
  nomeRecurso: string;
  /** Sanitiza a resposta (ex.: removePasswordDeep). */
  sanitize?: (data: unknown) => unknown;
  /** Mensagem para conflito de unicidade (Prisma P2002). */
  conflictMessage?: string;
  /** Mensagem para chave estrangeira inválida (Prisma P2003). */
  referenceMessage?: string;
  /** Extrai/transforma o body antes de criar (default: usa o body inteiro). */
  createExtractor?: (body: Record<string, unknown>) => CreateData;
  /** Extrai/transforma o body antes de atualizar (default: usa o body inteiro). */
  updateExtractor?: (body: Record<string, unknown>) => UpdateData;
}

/** Código de erro do Prisma (ex.: P2002), se houver. */
function prismaCode(err: unknown): string | undefined {
  return typeof err === "object" && err !== null ? (err as { code?: string }).code : undefined;
}

/**
 * Factory de controller CRUD.
 *
 * Elimina a duplicação entre os controllers de doctor/nurse/secretary/patient/
 * appointment/user: todos seguem o mesmo fluxo (getAll, getById, create, update,
 * delete) com tratamento padrão de ID, 404, P2002/P2003/P2025 e sanitização.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCrudController<T, CreateData = any, UpdateData = any>({
  service,
  nomeRecurso,
  sanitize,
  conflictMessage = "Já existe um registro com esses dados.",
  referenceMessage = "Registro relacionado não encontrado.",
  createExtractor = (body) => body as unknown as CreateData,
  updateExtractor = (body) => body as unknown as UpdateData,
}: CrudControllerOptions<T, CreateData, UpdateData>) {
  const send = (res: Response, status: number, data: unknown) => {
    res.status(status).json(sanitize ? sanitize(data) : data);
  };

  const parseId = (req: Request): number => Number(req.params.id);

  return {
    async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const items = await service.getAll();
        res.json(sanitize ? sanitize(items) : items);
      } catch (err) {
        next(err);
      }
    },

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const item = await service.getById(parseId(req));
        if (!item) {
          res.status(404).json({ message: `${nomeRecurso} não encontrado(a).` });
          return;
        }
        send(res, 200, item);
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const item = await service.create(createExtractor(req.body));
        send(res, 201, item);
      } catch (err: unknown) {
        if (prismaCode(err) === "P2002") {
          res.status(409).json({ message: conflictMessage });
        } else if (prismaCode(err) === "P2003") {
          res.status(400).json({ message: referenceMessage });
        } else {
          next(err);
        }
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const item = await service.update(parseId(req), updateExtractor(req.body));
        send(res, 200, item);
      } catch (err: unknown) {
        if (prismaCode(err) === "P2025") {
          res.status(404).json({ message: `${nomeRecurso} não encontrado(a).` });
        } else if (prismaCode(err) === "P2002") {
          res.status(409).json({ message: conflictMessage });
        } else {
          next(err);
        }
      }
    },

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        await service.delete(parseId(req));
        res.status(204).send();
      } catch (err: unknown) {
        if (prismaCode(err) === "P2025") {
          res.status(404).json({ message: `${nomeRecurso} não encontrado(a).` });
        } else {
          next(err);
        }
      }
    },
  };
}
