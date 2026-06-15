import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchAddress } from './address';

function stubFetch(responses: Array<{ ok: boolean; body?: unknown }>) {
  const fetchMock = vi.fn();
  responses.forEach(({ ok, body }) => {
    fetchMock.mockResolvedValueOnce({ ok, json: async () => body });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('fetchAddress', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('retorna o endereço a partir do mock (json-server)', async () => {
    const fetchMock = stubFetch([
      {
        ok: true,
        body: {
          address: 'Rua 206',
          neighborhood: 'Conjunto Ceará',
          city: 'Fortaleza',
          state: 'CE',
        },
      },
    ]);

    const result = await fetchAddress('60530-320');

    expect(fetchMock).toHaveBeenCalledWith('/api/ceps/60530320');
    expect(result).toEqual({
      address: 'Rua 206',
      neighborhood: 'Conjunto Ceará',
      city: 'Fortaleza',
      state: 'CE',
    });
  });

  it('faz fallback para o ViaCEP quando o mock não encontra', async () => {
    const fetchMock = stubFetch([
      { ok: false },
      {
        ok: true,
        body: { logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP' },
      },
    ]);

    const result = await fetchAddress('01001-000');

    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://viacep.com.br/ws/01001000/json/');
    expect(result).toEqual({
      address: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
    });
  });

  it('lança erro quando o ViaCEP retorna erro', async () => {
    stubFetch([{ ok: false }, { ok: true, body: { erro: true } }]);
    await expect(fetchAddress('00000-000')).rejects.toThrow('CEP não encontrado');
  });

  it('lança erro quando o ViaCEP responde com status inválido', async () => {
    stubFetch([{ ok: false }, { ok: false }]);
    await expect(fetchAddress('00000-000')).rejects.toThrow('CEP não encontrado');
  });
});
