export const canConvertToNumber = (str: string) => !isNaN(Number(str));

export const formattedNumber = (number: number) => new Intl.NumberFormat('ru-RU', {
  style: 'decimal',
  maximumFractionDigits: 2,
}).format(number);