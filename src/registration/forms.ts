export interface PersonalForm {
  fullName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  email: string;
}

export interface AddressForm {
  zipCode: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface WorkForm {
  company: string;
  profession: string;
  salary: string;
  companyTime: string;
}
