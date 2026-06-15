import { afterEach, describe, expect, it, vi } from 'vitest';
import { get, post } from './http';

describe('http', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('get faz GET no endpoint correto', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: 1 }) });
    vi.stubGlobal('fetch', fetchMock);

    const result = await get<{ ok: number }>('/professions');

    expect(fetchMock).toHaveBeenCalledWith('/api/professions');
    expect(result).toEqual({ ok: 1 });
  });

  it('get lança erro em status não ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(get('/x')).rejects.toThrow('Erro 404');
  });

  it('post envia o corpo serializado', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    vi.stubGlobal('fetch', fetchMock);

    const result = await post<{ id: number }>('/cep', { cep: '123' });

    expect(fetchMock).toHaveBeenCalledWith('/api/cep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep: '123' }),
    });
    expect(result).toEqual({ id: 1 });
  });

  it('post lança erro em status não ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(post('/x', {})).rejects.toThrow('Erro 500');
  });
});
