import { describe, expect, it } from 'vitest';
import {
  digitsOnly,
  formatBirthDate,
  formatCep,
  formatCpf,
  formatPhone,
  formatSalary,
  salaryToNumber,
  toBRL,
} from './format';

describe('format', () => {
  it('digitsOnly remove caracteres não numéricos', () => {
    expect(digitsOnly('abc123.456-7')).toBe('1234567');
    expect(digitsOnly('')).toBe('');
  });

  it('formatCpf formata e limita a 11 dígitos', () => {
    expect(formatCpf('12345678901')).toBe('123.456.789-01');
    expect(formatCpf('123456789012345')).toBe('123.456.789-01');
    expect(formatCpf('123')).toBe('123');
  });

  it('formatPhone formata fixo e celular', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    expect(formatPhone('11999998888')).toBe('(11) 99999-8888');
  });

  it('formatCep formata o CEP', () => {
    expect(formatCep('60530320')).toBe('60530-320');
    expect(formatCep('605')).toBe('605');
  });

  it('formatBirthDate formata a data', () => {
    expect(formatBirthDate('01012000')).toBe('01/01/2000');
    expect(formatBirthDate('0101')).toBe('01/01');
  });

  it('formatSalary formata em moeda brasileira', () => {
    expect(formatSalary('123456')).toBe('R$ 1.234,56');
    expect(formatSalary('')).toBe('');
    expect(formatSalary('5')).toBe('R$ 0,05');
  });

  it('salaryToNumber converte string mascarada em número', () => {
    expect(salaryToNumber('R$ 1.234,56')).toBe(1234.56);
    expect(salaryToNumber('')).toBe(0);
  });

  it('toBRL formata número em BRL', () => {
    expect(toBRL(1234.56)).toContain('1.234,56');
  });
});
