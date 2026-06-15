import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Registration } from './Registration';
import { useRegistration } from './store';
import { fetchProfessions } from '../services/professions';
import { fetchAddress } from '../services/address';
import { downloadSummaryPdf } from '../services/pdf';

vi.mock('../services/professions', () => ({ fetchProfessions: vi.fn() }));
vi.mock('../services/address', () => ({ fetchAddress: vi.fn() }));
vi.mock('../services/pdf', () => ({ downloadSummaryPdf: vi.fn() }));

const fetchProfessionsMock = vi.mocked(fetchProfessions);
const fetchAddressMock = vi.mocked(fetchAddress);
const downloadPdfMock = vi.mocked(downloadSummaryPdf);

const PROFESSIONS = [
  { id: '1', label: 'Programador' },
  { id: '2', label: 'Médico' },
];

const ADDRESS = {
  address: 'Rua 206',
  neighborhood: 'Conjunto Ceará',
  city: 'Fortaleza',
  state: 'CE',
};

async function fillPersonalStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nome completo'), 'João da Silva');
  await user.type(screen.getByLabelText('Data de nascimento'), '01012000');
  await user.type(screen.getByLabelText('CPF'), '52998224725');
  await user.type(screen.getByLabelText('Telefone'), '11999998888');
  await user.type(screen.getByLabelText('E-mail'), 'joao@email.com');
}

beforeEach(() => {
  useRegistration.getState().clear();
  fetchProfessionsMock.mockResolvedValue(PROFESSIONS);
  fetchAddressMock.mockResolvedValue(ADDRESS);
  downloadPdfMock.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Registration', () => {
  it('percorre as 3 etapas, exibe o resumo, exporta o PDF e reinicia', async () => {
    const user = userEvent.setup();
    render(<Registration />);

    expect(screen.getByText(/Etapa 1 de 3/)).toBeInTheDocument();

    await fillPersonalStep(user);
    await user.click(screen.getByRole('button', { name: /Avançar/ }));

    const cepInput = await screen.findByLabelText('CEP');
    await user.type(cepInput, '60530320');
    await user.tab();

    await waitFor(() => expect(fetchAddressMock).toHaveBeenCalledWith('60530-320'));
    await waitFor(() =>
      expect((screen.getByLabelText('Cidade') as HTMLInputElement).value).toBe('Fortaleza'),
    );

    await user.click(screen.getByRole('button', { name: /Avançar/ }));

    const professionSelect = await screen.findByLabelText('Profissão');
    await user.selectOptions(professionSelect, 'Programador');
    await user.type(screen.getByLabelText('Empresa'), 'Verity');
    await user.type(screen.getByLabelText('Salário'), '500000');
    await user.type(screen.getByLabelText('Tempo de empresa'), '2 anos');

    await user.click(screen.getByRole('button', { name: /Concluir/ }));

    expect(await screen.findByText(/Confira o resumo/)).toBeInTheDocument();
    expect(screen.getByText('João da Silva')).toBeInTheDocument();
    expect(screen.getByText('Fortaleza / CE')).toBeInTheDocument();
    expect(screen.getByText('R$ 5.000,00')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Exportar PDF/ }));
    expect(downloadPdfMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Recomeçar/ }));
    expect(screen.getByText(/Etapa 1 de 3/)).toBeInTheDocument();
    expect(useRegistration.getState().personal).toBeNull();
  });

  it('bloqueia o avanço e exibe erros quando a etapa é inválida', async () => {
    const user = userEvent.setup();
    render(<Registration />);

    await user.click(screen.getByRole('button', { name: /Avançar/ }));

    expect(await screen.findByText('Informe seu nome completo.')).toBeInTheDocument();
    expect(screen.getByText(/Etapa 1 de 3/)).toBeInTheDocument();
  });

  it('exibe mensagem quando o CEP não é encontrado', async () => {
    fetchAddressMock.mockRejectedValueOnce(new Error('CEP não encontrado'));
    const user = userEvent.setup();
    render(<Registration />);

    await fillPersonalStep(user);
    await user.click(screen.getByRole('button', { name: /Avançar/ }));

    const cepInput = await screen.findByLabelText('CEP');
    await user.type(cepInput, '99999999');
    await user.tab();

    expect(await screen.findByText(/CEP não encontrado/)).toBeInTheDocument();
  });

  it('permite voltar para a etapa anterior', async () => {
    const user = userEvent.setup();
    render(<Registration />);

    await fillPersonalStep(user);
    await user.click(screen.getByRole('button', { name: /Avançar/ }));

    expect(await screen.findByLabelText('CEP')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Voltar/ }));
    expect(screen.getByText(/Etapa 1 de 3/)).toBeInTheDocument();
  });

  it('não trava quando o carregamento de profissões falha', async () => {
    fetchProfessionsMock.mockRejectedValueOnce(new Error('falha'));
    render(<Registration />);

    await waitFor(() => expect(fetchProfessionsMock).toHaveBeenCalled());
    expect(screen.getByText(/Etapa 1 de 3/)).toBeInTheDocument();
  });
});
