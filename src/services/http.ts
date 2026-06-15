const API = '/api';

async function readJson<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao chamar ${path}`);
  }

  return (await response.json()) as T;
}

export async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`);
  return readJson<T>(response, path);
}

export async function post<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return readJson<T>(response, path);
}
