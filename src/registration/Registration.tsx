import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, ChevronLeft, ChevronRight, Download, RotateCcw } from 'lucide-react';

import { PersonalStep } from './components/PersonalStep';
import { AddressStep } from './components/AddressStep';
import { WorkStep } from './components/WorkStep';
import { Summary } from './components/Summary';
import { useRegistration } from './store';
import { digitsOnly, salaryToNumber } from './format';
import type { PersonalForm, AddressForm, WorkForm } from './forms';
import type { Profession } from '../types';
import { fetchProfessions } from '../services/professions';
import { fetchAddress } from '../services/address';
import { downloadSummaryPdf } from '../services/pdf';

import './registration.scss';

const STEPS = [
  { label: 'Dados pessoais', blurb: 'Conte um pouco sobre você.' },
  { label: 'Endereço', blurb: 'Onde podemos te encontrar?' },
  { label: 'Trabalho', blurb: 'Fale sobre sua ocupação.' },
];

export function Registration() {
  const [step, setStep] = useState(0);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const registration = useRegistration();

  const personalForm = useForm<PersonalForm>({
    mode: 'onTouched',
    defaultValues: { fullName: '', birthDate: '', cpf: '', phone: '', email: '' },
  });
  const addressForm = useForm<AddressForm>({
    mode: 'onTouched',
    defaultValues: { zipCode: '', address: '', neighborhood: '', city: '', state: '' },
  });
  const workForm = useForm<WorkForm>({
    mode: 'onTouched',
    defaultValues: { company: '', profession: '', salary: '', companyTime: '' },
  });

  const onLastStep = step === STEPS.length - 1;
  const reviewing = step === STEPS.length;

  useEffect(() => {
    fetchProfessions()
      .then(setProfessions)
      .catch(() => setProfessions([]));
  }, []);

  const lookupAddress = useCallback(
    (cep: string) => {
      if (digitsOnly(cep).length !== 8) {
        return;
      }

      setLooking(true);
      setLookupError(null);

      fetchAddress(cep)
        .then((found) => {
          addressForm.setValue('address', found.address);
          addressForm.setValue('neighborhood', found.neighborhood);
          addressForm.setValue('city', found.city);
          addressForm.setValue('state', found.state);
        })
        .catch(() => {
          setLookupError('CEP não encontrado. Preencha o endereço manualmente.');
        })
        .finally(() => setLooking(false));
    },
    [addressForm],
  );

  const persist = useCallback(() => {
    const personal = personalForm.getValues();
    const address = addressForm.getValues();
    const work = workForm.getValues();

    registration.savePersonal({ ...personal });
    registration.saveAddress({ ...address });
    registration.saveWork({
      company: work.company,
      profession: work.profession,
      salary: salaryToNumber(work.salary),
      companyTime: work.companyTime,
    });
  }, [personalForm, addressForm, workForm, registration]);

  const validateStep = useCallback(async (): Promise<boolean> => {
    if (step === 0) return personalForm.trigger();
    if (step === 1) return addressForm.trigger();
    return workForm.trigger();
  }, [step, personalForm, addressForm, workForm]);

  const goNext = useCallback(async () => {
    if (!(await validateStep())) {
      return;
    }

    if (onLastStep) {
      persist();
    }

    setStep((value) => value + 1);
  }, [validateStep, onLastStep, persist]);

  const goBack = useCallback(() => {
    setStep((value) => Math.max(0, value - 1));
  }, []);

  const jumpTo = useCallback((target: number) => {
    setStep(target);
  }, []);

  const exportPdf = useCallback(() => {
    const { personal, address, work } = useRegistration.getState();
    if (!personal || !address || !work) {
      return;
    }

    downloadSummaryPdf({ personal, address, work });
  }, []);

  const startOver = useCallback(() => {
    personalForm.reset();
    addressForm.reset();
    workForm.reset();
    registration.clear();
    setLookupError(null);
    setStep(0);
  }, [personalForm, addressForm, workForm, registration]);

  const heading = reviewing ? 'Quase lá!' : STEPS[step].label;
  const subtitle = reviewing ? 'Revise os dados antes de finalizar.' : STEPS[step].blurb;

  return (
    <div className="wizard">
      <div className="wizard__shell">
        <section className="wizard__panel">
          <header className="panel__head">
            {reviewing ? null : (
              <p className="panel__step">
                Etapa {step + 1} de {STEPS.length}
              </p>
            )}
            <h1 className="panel__title">{heading}</h1>
            <p className="panel__subtitle">{subtitle}</p>
          </header>

          <div className="panel__body">
            {step === 0 ? <PersonalStep form={personalForm} /> : null}
            {step === 1 ? (
              <AddressStep
                form={addressForm}
                onLookup={lookupAddress}
                looking={looking}
                lookupError={lookupError}
              />
            ) : null}
            {step === 2 ? <WorkStep form={workForm} professions={professions} /> : null}
            {reviewing ? <Summary onEdit={jumpTo} /> : null}
          </div>

          <footer className="panel__foot">
            {reviewing ? (
              <>
                <button type="button" className="btn btn--soft" onClick={startOver}>
                  <RotateCcw size={18} />
                  Recomeçar
                </button>
                <button type="button" className="btn btn--solid" onClick={exportPdf}>
                  <Download size={18} />
                  Exportar PDF
                </button>
              </>
            ) : (
              <>
                {step > 0 ? (
                  <button type="button" className="btn btn--soft" onClick={goBack}>
                    <ChevronLeft size={18} />
                    Voltar
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" className="btn btn--solid" onClick={goNext}>
                  {onLastStep ? 'Concluir' : 'Avançar'}
                  {onLastStep ? <Check size={18} /> : <ChevronRight size={18} />}
                </button>
              </>
            )}
          </footer>
        </section>
      </div>
    </div>
  );
}
