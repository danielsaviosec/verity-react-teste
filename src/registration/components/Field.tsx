import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, wide, children }: FieldProps) {
  const classes = ['field'];
  if (wide) classes.push('field--wide');
  if (error) classes.push('field--invalid');

  return (
    <div className={classes.join(' ')}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? (
        <span className="field__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
