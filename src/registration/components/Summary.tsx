import { Briefcase, MapPin, PartyPopper, Pencil, UserRound, type LucideIcon } from 'lucide-react';
import { useRegistration } from '../store';
import { toBRL } from '../format';

interface SummaryProps {
  onEdit: (step: number) => void;
}

interface BlockProps {
  title: string;
  icon: LucideIcon;
  step: number;
  onEdit: (step: number) => void;
  rows: Array<{ label: string; value?: string; wide?: boolean }>;
}

function Block({ title, icon: Icon, step, onEdit, rows }: BlockProps) {
  return (
    <section className="card">
      <header className="card__head">
        <h3 className="card__title">
          <Icon size={16} />
          {title}
        </h3>
        <button type="button" className="link" onClick={() => onEdit(step)}>
          <Pencil size={14} />
          Editar
        </button>
      </header>
      <dl className="card__grid">
        {rows.map((row) => (
          <div key={row.label} className={row.wide ? 'card__cell card__cell--wide' : 'card__cell'}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Summary({ onEdit }: SummaryProps) {
  const personal = useRegistration((state) => state.personal);
  const address = useRegistration((state) => state.address);
  const work = useRegistration((state) => state.work);

  return (
    <div className="review">
      <p className="notice notice--ok">
        <PartyPopper size={18} />
        Tudo certo! Confira o resumo do cadastro abaixo.
      </p>

      <Block
        title="Dados pessoais"
        icon={UserRound}
        step={0}
        onEdit={onEdit}
        rows={[
          { label: 'Nome', value: personal?.fullName },
          { label: 'Nascimento', value: personal?.birthDate },
          { label: 'CPF', value: personal?.cpf },
          { label: 'Telefone', value: personal?.phone },
          { label: 'E-mail', value: personal?.email, wide: true },
        ]}
      />

      <Block
        title="Endereço"
        icon={MapPin}
        step={1}
        onEdit={onEdit}
        rows={[
          { label: 'CEP', value: address?.zipCode },
          { label: 'Endereço', value: address?.address, wide: true },
          { label: 'Bairro', value: address?.neighborhood },
          {
            label: 'Cidade / Estado',
            value: address ? `${address.city} / ${address.state}` : '',
            wide: true,
          },
        ]}
      />

      <Block
        title="Trabalho"
        icon={Briefcase}
        step={2}
        onEdit={onEdit}
        rows={[
          { label: 'Empresa', value: work?.company },
          { label: 'Profissão', value: work?.profession },
          { label: 'Salário', value: work ? toBRL(work.salary) : '' },
          { label: 'Tempo de empresa', value: work?.companyTime },
        ]}
      />
    </div>
  );
}
