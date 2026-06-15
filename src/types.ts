export interface Profession {
  id: string;
  label: string;
}

export interface FoundAddress {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface PersonalInfo {
  fullName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  email: string;
}

export interface AddressInfo {
  zipCode: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface WorkInfo {
  company: string;
  profession: string;
  salary: number;
  companyTime: string;
}

export interface Registration {
  id: string;
  personal: PersonalInfo;
  address: AddressInfo;
  work: WorkInfo;
}
