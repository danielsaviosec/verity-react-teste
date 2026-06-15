import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchProfessions } from './professions';

describe('fetchProfessions', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('retorna a lista de profissões', async () => {
    const professions = [
      { id: '1', label: 'Programador' },
      { id: '2', label: 'Médico' },
    ];
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => professions });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchProfessions();

    expect(fetchMock).toHaveBeenCalledWith('/api/professions');
    expect(result).toEqual(professions);
  });

  it('lança erro quando a resposta não é ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(fetchProfessions()).rejects.toThrow('Erro 500');
  });
});
