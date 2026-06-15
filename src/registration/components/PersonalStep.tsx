import { Controller, type UseFormReturn } from 'react-hook-form';
import { Field } from './Field';
import type { PersonalForm } from '../forms';
import { formatBirthDate, formatCpf, formatPhone } from '../format';
import { validateBirthDate, validateCpf, validateEmail, validatePhone } from '../validation';

interface PersonalStepProps {
  form: UseFormReturn<PersonalForm>;
}

export function PersonalStep({ form }: PersonalStepProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <form className="grid" noValidate>
      <Field label="Nome completo" htmlFor="fullName" error={errors.fullName?.message} wide>
        <input
          id="fullName"
          className="field__input"
          autoComplete="name"
          {...register('fullName', {
            required: 'Informe seu nome completo.',
            minLength: { value: 3, message: 'Informe seu nome completo.' },
          })}
        />
      </Field>

      <Field label="Data de nascimento" htmlFor="birthDate" error={errors.birthDate?.message}>
        <Controller
          name="birthDate"
          control={control}
          rules={{ required: 'Data inválida.', validate: validateBirthDate }}
          render={({ field }) => (
            <input
              id="birthDate"
              className="field__input"
              placeholder="dd/mm/aaaa"
              inputMode="numeric"
              value={field.value}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(formatBirthDate(event.target.value))}
            />
          )}
        />
      </Field>

      <Field label="CPF" htmlFor="cpf" error={errors.cpf?.message}>
        <Controller
          name="cpf"
          control={control}
          rules={{ required: 'CPF inválido.', validate: validateCpf }}
          render={({ field }) => (
            <input
              id="cpf"
              className="field__input"
              placeholder="000.000.000-00"
              inputMode="numeric"
              value={field.value}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(formatCpf(event.target.value))}
            />
          )}
        />
      </Field>

      <Field label="Telefone" htmlFor="phone" error={errors.phone?.message}>
        <Controller
          name="phone"
          control={control}
          rules={{ required: 'Telefone inválido.', validate: validatePhone }}
          render={({ field }) => (
            <input
              id="phone"
              className="field__input"
              placeholder="(00) 00000-0000"
              inputMode="numeric"
              value={field.value}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(formatPhone(event.target.value))}
            />
          )}
        />
      </Field>

      <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          className="field__input"
          placeholder="nome@email.com"
          autoComplete="email"
          {...register('email', { required: 'Informe seu e-mail.', validate: validateEmail })}
        />
      </Field>
    </form>
  );
}
