/**
 * Generador de IDs únicos para optimistic updates
 * Combina timestamp con un contador para evitar colisiones
 */
let counter = 0;

export const generateTempId = (): number => {
  const timestamp = Date.now();
  counter = (counter + 1) % 1000; // Reset cada 1000 para evitar números muy grandes
  // Combinar timestamp con contador para garantizar unicidad
  return timestamp * 1000 + counter;
};

/**
 * Genera un ID temporal negativo para distinguirlo de IDs reales del backend
 * Útil para optimistic updates donde el backend asignará el ID real
 */
export const generateNegativeTempId = (): number => {
  return -generateTempId();
};

