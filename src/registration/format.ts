export function digitsOnly(value: string): string {
  return (value ?? '').replace(/\D/g, '');
}

export function formatCpf(value: string): string {
  return digitsOnly(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatPhone(value: string): string {
  const digits = digitsOnly(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }

  return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

export function formatCep(value: string): string {
  return digitsOnly(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

export function formatBirthDate(value: string): string {
  return digitsOnly(value)
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

export function formatSalary(value: string): string {
  const digits = digitsOnly(value);
  if (!digits) {
    return '';
  }

  const withCents = (Number(digits) / 100).toFixed(2);
  const [reais, cents] = withCents.split('.');
  const grouped = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `R$ ${grouped},${cents}`;
}

export function salaryToNumber(value: string): number {
  const digits = digitsOnly(value);
  return digits ? Number(digits) / 100 : 0;
}

export function toBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
