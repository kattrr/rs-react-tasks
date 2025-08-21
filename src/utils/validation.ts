export interface PasswordStrength {
  score: number;
  hasNumber: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasSpecialChar: boolean;
}

export const validatePasswordStrength = (
  password: string
): PasswordStrength => {
  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const score = [hasNumber, hasUpperCase, hasLowerCase, hasSpecialChar].filter(
    Boolean
  ).length;

  return {
    score,
    hasNumber,
    hasUpperCase,
    hasLowerCase,
    hasSpecialChar,
  };
};

export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only PNG and JPEG files are allowed' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }

  return { isValid: true };
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const filterCountries = (
  countries: string[],
  query: string
): string[] => {
  if (!query.trim()) return countries;
  return countries.filter((country) =>
    country.toLowerCase().includes(query.toLowerCase())
  );
};
