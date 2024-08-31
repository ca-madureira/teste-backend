export const isBase64Image = (base64String: string): boolean => {
  const base64Pattern = /^data:image\/(png|jpg|jpeg);base64,/;
  return base64Pattern.test(base64String);
};

export const isString = (value: any): boolean =>
  typeof value === 'string' && value.trim().length > 0;

export const isInteger = (value: any): boolean =>
  typeof value === 'number' && Number.isInteger(value);

export const isDatetime = (value: any): boolean => !isNaN(Date.parse(value));

export const isBase64 = (value: any): boolean =>
  isString(value) && isBase64Image(value);

export const isTypeMeasure = (value: any): boolean => {
  const types = ['WATER', 'GAS', 'water', 'gas'];
  return typeof value === 'string' && types.includes(value);
};
