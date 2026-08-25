/**
 * Lógica para verificar si la suscripción de $9.99/mes de la farmacia está activa
 */
export function isSubscriptionActive(pharmacy) {
  if (!pharmacy) return false;

  // Si fue suspendida manualmente por el Super Admin
  if (pharmacy.subscription_status === 'SUSPENDED') return false;

  // Verificar si la fecha de vencimiento ya pasó
  if (pharmacy.subscription_expires_at) {
    const expirationDate = new Date(pharmacy.subscription_expires_at);
    const currentDate = new Date();

    if (currentDate > expirationDate) {
      return false; // Suscripción vencida
    }
  }

  return (
    pharmacy.subscription_status === 'ACTIVE' || 
    pharmacy.subscription_status === 'PENDING_APPROVAL'
  );
}