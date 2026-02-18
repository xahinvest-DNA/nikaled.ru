export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const formatPhoneRu = (raw: string) => {
  let digits = onlyDigits(raw);
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith("7")) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const p1 = digits.slice(1, 4);
  const p2 = digits.slice(4, 7);
  const p3 = digits.slice(7, 9);
  const p4 = digits.slice(9, 11);

  let out = "+7";
  if (p1) out += ` (${p1}`;
  if (p1.length === 3) out += ")";
  if (p2) out += ` ${p2}`;
  if (p3) out += `-${p3}`;
  if (p4) out += `-${p4}`;

  return out;
};

export const isValidRuPhone = (value: string) => {
  const digits = onlyDigits(value);
  return digits.length === 11 && digits.startsWith("7");
};

