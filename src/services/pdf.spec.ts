import { describe, expect, it, vi } from 'vitest';

const textMock = vi.fn();
const saveMock = vi.fn();
const setFontSizeMock = vi.fn();
const setFontMock = vi.fn();

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    text: textMock,
    save: saveMock,
    setFontSize: setFontSizeMock,
    setFont: setFontMock,
  })),
}));

import { downloadSummaryPdf } from './pdf';

describe('downloadSummaryPdf', () => {
  it('gera o PDF com os dados e salva o arquivo', () => {
    downloadSummaryPdf({
      personal: {
        fullName: 'João',
        birthDate: '01/01/2000',
        cpf: '529.982.247-25',
        phone: '(11) 99999-8888',
        email: 'joao@email.com',
      },
      address: {
        zipCode: '60530-320',
        address: 'Rua 206',
        neighborhood: 'Conjunto Ceará',
        city: 'Fortaleza',
        state: 'CE',
      },
      work: {
        company: 'Verity',
        profession: 'Programador',
        salary: 1000,
        companyTime: '2 anos',
      },
    });

    expect(saveMock).toHaveBeenCalledWith('cadastro.pdf');
    const printed = textMock.mock.calls.map((call) => call[0]);
    expect(printed).toContain('Resumo do Cadastro');
    expect(printed).toContain('Nome completo: João');
  });
});
