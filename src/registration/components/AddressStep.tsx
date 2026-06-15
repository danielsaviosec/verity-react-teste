import { Controller, type UseFormReturn } from 'react-hook-form';
import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { Field } from './Field';
import type { AddressForm } from '../forms';
import { formatCep } from '../format';

interface AddressStepProps {
  form: UseFormReturn<AddressForm>;
  onLookup: (cep: string) => void;
  looking: boolean;
  lookupError: string | null;
}

export function AddressStep({ form, onLookup, looking, lookupError }: AddressStepProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <form className="grid" noValidate>
      <Field label="CEP" htmlFor="zipCode" error={errors.zipCode?.message}>
        <div className="field__addon">
          <Controller
            name="zipCode"
            control={control}
            rules={{ required: 'Informe o CEP.' }}
            render={({ field }) => (
              <input
                id="zipCode"
                className="field__input"
                placeholder="00000-000"
                inputMode="numeric"
                value={field.value}
                onChange={(event) => field.onChange(formatCep(event.target.value))}
                onBlur={(event) => {
                  field.onBlur();
                  onLookup(event.target.value);
                }}
              />
            )}
          />
          {looking ? <LoaderCircle className="field__loader" size={18} /> : null}
        </div>
      </Field>

      <div className="field--wide">
        {lookupError ? (
          <p className="notice notice--warn">
            <TriangleAlert size={18} />
            {lookupError}
          </p>
        ) : null}
      </div>

      <Field label="Endereço" htmlFor="address" error={errors.address?.message} wide>
        <input
          id="address"
          className="field__input"
          {...register('address', { required: 'Informe o endereço.' })}
        />
      </Field>

      <Field label="Bairro" htmlFor="neighborhood" error={errors.neighborhood?.message}>
        <input
          id="neighborhood"
          className="field__input"
          {...register('neighborhood', { required: 'Informe o bairro.' })}
        />
      </Field>

      <Field label="Cidade" htmlFor="city" error={errors.city?.message}>
        <input
          id="city"
          className="field__input"
          {...register('city', { required: 'Informe a cidade.' })}
        />
      </Field>

      <Field label="Estado" htmlFor="state" error={errors.state?.message} wide>
        <input
          id="state"
          className="field__input"
          maxLength={2}
          {...register('state', { required: 'Informe o estado.' })}
        />
      </Field>
    </form>
  );
}
