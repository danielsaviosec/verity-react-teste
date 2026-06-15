import { describe, expect, it } from 'vitest';
import {
  validateBirthDate,
  validateCpf,
  validateEmail,
  validatePhone,
  validateSalary,
} from './validation';

describe('validateCpf', () => {
  it('aceita vazio (obrigatoriedade fica a cargo do required)', () => {
    expect(validateCpf('')).toBe(true);
  });

  it('aceita CPF válido', () => {
    expect(validateCpf('529.982.247-25')).toBe(true);
  });

  it('rejeita CPF com dígitos repetidos', () => {
    expect(validateCpf('111.111.111-11')).toBe('CPF inválido.');
  });

  it('rejeita CPF com tamanho incorreto', () => {
    expect(validateCpf('123')).toBe('CPF inválido.');
  });

  it('rejeita CPF com dígito verificador inválido', () => {
    expect(validateCpf('529.982.247-20')).toBe('CPF inválido.');
  });
});

describe('validateBirthDate', () => {
  it('aceita vazio', () => {
    expect(validateBirthDate('')).toBe(true);
  });

  it('aceita data válida', () => {
    expect(validateBirthDate('01/01/2000')).toBe(true);
  });

  it('rejeita formato inválido', () => {
    expect(validateBirthDate('2000-01-01')).toBe('Data inválida.');
  });

  it('rejeita data inexistente', () => {
    expect(validateBirthDate('31/02/2000')).toBe('Data inválida.');
  });

  it('rejeita data futura', () => {
    expect(validateBirthDate('01/01/2999')).toBe('Data inválida.');
  });

  it('rejeita ano anterior a 1900', () => {
    expect(validateBirthDate('01/01/1899')).toBe('Data inválida.');
  });
});

describe('validatePhone', () => {
  it('aceita vazio', () => {
    expect(validatePhone('')).toBe(true);
  });

  it('aceita telefone fixo e celular', () => {
    expect(validatePhone('(11) 3333-4444')).toBe(true);
    expect(validatePhone('(11) 99999-8888')).toBe(true);
  });

  it('rejeita telefone curto', () => {
    expect(validatePhone('123')).toBe('Telefone inválido.');
  });
});

describe('validateSalary', () => {
  it('aceita vazio', () => {
    expect(validateSalary('')).toBe(true);
  });

  it('aceita salário positivo', () => {
    expect(validateSalary('R$ 1.000,00')).toBe(true);
  });

  it('rejeita salário zero', () => {
    expect(validateSalary('R$ 0,00')).toBe('Informe um salário válido.');
  });
});

describe('validateEmail', () => {
  it('aceita vazio', () => {
    expect(validateEmail('')).toBe(true);
  });

  it('aceita e-mail válido', () => {
    expect(validateEmail('teste@email.com')).toBe(true);
  });

  it('rejeita e-mail inválido', () => {
    expect(validateEmail('teste@')).toBe('E-mail inválido.');
  });
});
