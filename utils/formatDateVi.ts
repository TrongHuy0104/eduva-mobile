// utils/formatDateVi.ts
export function formatDateVi(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  // Use 'vi-VN' locale, show weekday, day, month, year
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
