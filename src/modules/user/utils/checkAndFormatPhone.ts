import { AppError } from '@core/errors/AppError';

export const checkAndFormatPhone = (phone: string): string => {
  const isValid =
    /^(?:(?:\+55|00)?\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/.test(
      phone,
    );

  if (!isValid) {
    throw new AppError('Telefone inválido');
  }

  const formatedPhone = phone.replace(/\.|-|\(|\)|\+55|/g, '').trim();

  return `+55${formatedPhone}`;
};
