import type { FoundAddress } from '../types';

interface ViaCep {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchAddress(cep: string): Promise<FoundAddress> {
  const digits = cep.replace(/\D/g, '');

  const local = await fetch(`/api/ceps/${digits}`);
  if (local.ok) {
    const found = (await local.json()) as FoundAddress;
    return {
      address: found.address,
      neighborhood: found.neighborhood,
      city: found.city,
      state: found.state,
    };
  }

  return fetchFromViaCep(digits);
}

async function fetchFromViaCep(digits: string): Promise<FoundAddress> {
  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!response.ok) {
    throw new Error('CEP não encontrado');
  }

  const data = (await response.json()) as ViaCep;
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return {
    address: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
  };
}
