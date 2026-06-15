import { get } from './http';
import type { Profession } from '../types';

export function fetchProfessions(): Promise<Profession[]> {
  return get<Profession[]>('/professions');
}
