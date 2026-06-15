import { Controller, type UseFormReturn } from 'react-hook-form';
import { Field } from './Field';
import type { WorkForm } from '../forms';
import type { Profession } from '../../types';
import { formatSalary } from '../format';
import { validateSalary } from '../validation';

interface WorkStepProps {
  form: UseFormReturn<WorkForm>;
  professions: Profession[];
}

export function WorkStep({ form, professions }: WorkStepProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <form className="grid" noValidate>
      <Field label="Empresa" htmlFor="company" error={errors.company?.message}>
        <input
          id="company"
          className="field__input"
          {...register('company', { required: 'Informe a empresa.' })}
        />
      </Field>

      <Field label="Profissão" htmlFor="profession" error={errors.profession?.message}>
        <select
          id="profession"
          className="field__input"
          {...register('profession', { required: 'Selecione uma profissão.' })}
        >
          <option value="" disabled>
            Selecione...
          </option>
          {professions.map((profession) => (
            <option key={profession.id} value={profession.label}>
              {profession.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Salário" htmlFor="salary" error={errors.salary?.message}>
        <Controller
          name="salary"
          control={control}
          rules={{ required: 'Informe um salário válido.', validate: validateSalary }}
          render={({ field }) => (
            <input
              id="salary"
              className="field__input"
              placeholder="R$ 0,00"
              inputMode="numeric"
              value={field.value}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(formatSalary(event.target.value))}
            />
          )}
        />
      </Field>

      <Field label="Tempo de empresa" htmlFor="companyTime" error={errors.companyTime?.message}>
        <input
          id="companyTime"
          className="field__input"
          placeholder="Ex.: 2 anos"
          {...register('companyTime', { required: 'Informe o tempo de empresa.' })}
        />
      </Field>
    </form>
  );
}
