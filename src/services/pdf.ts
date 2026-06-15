import { jsPDF } from 'jspdf';
import type { PersonalInfo, AddressInfo, WorkInfo } from '../types';
import { toBRL } from '../registration/format';

export interface SummaryData {
  personal: PersonalInfo;
  address: AddressInfo;
  work: WorkInfo;
}

export function downloadSummaryPdf({ personal, address, work }: SummaryData): void {
  const doc = new jsPDF();
  let cursor = 20;

  const heading = (text: string): void => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(text, 14, cursor);
    cursor += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
  };

  const row = (label: string, value: string | number): void => {
    doc.text(`${label}: ${value}`, 18, cursor);
    cursor += 7;
  };

  doc.setFontSize(18);
  doc.text('Resumo do Cadastro', 14, cursor);
  cursor += 12;

  heading('Dados Pessoais');
  row('Nome completo', personal.fullName);
  row('Data de nascimento', personal.birthDate);
  row('CPF', personal.cpf);
  row('Telefone', personal.phone);
  row('E-mail', personal.email);
  cursor += 4;

  heading('Endereço');
  row('CEP', address.zipCode);
  row('Endereço', address.address);
  row('Bairro', address.neighborhood);
  row('Cidade', address.city);
  row('Estado', address.state);
  cursor += 4;

  heading('Trabalho');
  row('Empresa', work.company);
  row('Profissão', work.profession);
  row('Salário', toBRL(work.salary));
  row('Tempo de empresa', work.companyTime);

  doc.save('cadastro.pdf');
}
