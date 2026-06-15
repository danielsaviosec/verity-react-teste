import { digitsOnly } from './format';

export function validateCpf(value: string): true | string {
  const cpf = digitsOnly(value ?? '');
  if (!cpf) {
    return true;
  }

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return 'CPF inválido.';
  }

  const checkDigit = (length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(cpf[i]) * (length + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  if (checkDigit(9) !== Number(cpf[9]) || checkDigit(10) !== Number(cpf[10])) {
    return 'CPF inválido.';
  }

  return true;
}

export function validateBirthDate(value: string): true | string {
  const text = value ?? '';
  if (!text) {
    return true;
  }

  const parts = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!parts) {
    return 'Data inválida.';
  }

  const [, dayStr, monthStr, yearStr] = parts;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  const date = new Date(year, month - 1, day);
  const exists =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  if (!exists) {
    return 'Data inválida.';
  }

  if (date.getTime() > Date.now() || year < 1900) {
    return 'Data inválida.';
  }

  return true;
}

export function validatePhone(value: string): true | string {
  const phone = digitsOnly(value ?? '');
  if (!phone) {
    return true;
  }

  return phone.length >= 10 && phone.length <= 11 ? true : 'Telefone inválido.';
}

export function validateSalary(value: string): true | string {
  const digits = digitsOnly(value ?? '');
  if (!digits) {
    return true;
  }

  return Number(digits) > 0 ? true : 'Informe um salário válido.';
}

export function validateEmail(value: string): true | string {
  const text = (value ?? '').trim();
  if (!text) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? true : 'E-mail inválido.';
}
