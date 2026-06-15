import { beforeEach, describe, expect, it } from 'vitest';
import { isComplete, useRegistration } from './store';

describe('registration store', () => {
  beforeEach(() => {
    useRegistration.getState().clear();
  });

  it('inicia vazio e incompleto', () => {
    const state = useRegistration.getState();
    expect(state.personal).toBeNull();
    expect(isComplete(state)).toBe(false);
  });

  it('armazena os dados de cada etapa', () => {
    const { savePersonal, saveAddress, saveWork } = useRegistration.getState();

    savePersonal({
      fullName: 'Daniel Savio',
      birthDate: '30/04/1995',
      cpf: '045.480.403-23',
      phone: '(85) 99999-8888',
      email: 'daniel@email.com',
    });
    saveAddress({
      zipCode: '60530-320',
      address: 'Rua 206',
      neighborhood: 'Conjunto Ceará',
      city: 'Fortaleza',
      state: 'CE',
    });
    saveWork({
      company: 'Verity',
      profession: 'Programador',
      salary: 1000,
      companyTime: '2 anos',
    });

    const state = useRegistration.getState();
    expect(state.personal?.fullName).toBe('Daniel Savio');
    expect(state.address?.city).toBe('Fortaleza');
    expect(state.work?.salary).toBe(1000);
    expect(isComplete(state)).toBe(true);
  });

  it('clear limpa os dados', () => {
    const { savePersonal, clear } = useRegistration.getState();
    savePersonal({
      fullName: 'Daniel Savio',
      birthDate: '30/04/1995',
      cpf: '045.480.403-23',
      phone: '(85) 99999-8888',
      email: 'daniel@email.com',
    });
    clear();
    expect(useRegistration.getState().personal).toBeNull();
  });
});
