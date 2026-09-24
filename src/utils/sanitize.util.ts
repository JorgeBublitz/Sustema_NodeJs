/**
 * Remove a propriedade `password` de qualquer estrutura (objeto ou array),
 * incluindo usuários aninhados em relacionamentos (doctor.user, etc.).
 */
export function removePasswordDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removePasswordDeep(item)) as unknown as T;
  }

  // Mantém Date (e outros objetos que não são "simples") intactos: antes as datas
  // viravam {} na resposta porque Object.entries(new Date()) é vazio
  if (value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (key === "password") continue;
      result[key] = removePasswordDeep(val);
    }
    return result as T;
  }

  return value;
}
