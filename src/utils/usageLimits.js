// src/utils/usageLimits.js
// 🔥 IMPORTANTE: USE_LAMBDA = false para usar localStorage (evita errores de importación)
const USE_LAMBDA = false;

const USAGE_KEY = 'ubikfarma_usage';

const getDefaultUsage = () => ({
  plan: 'FREE',
  monthlyRequests: 2,
  usedRequests: 0,
  monthlyMedicines: 4,
  usedMedicines: 0,
  lastReset: new Date().toISOString(),
});

// Obtener el uso actual del paciente (versión localStorage)
const checkPatientLimitLocal = (patientId) => {
  const stored = localStorage.getItem(`${USAGE_KEY}_${patientId}`);
  let usage = stored ? JSON.parse(stored) : getDefaultUsage();

  const today = new Date();
  const lastReset = new Date(usage.lastReset);
  if (today.getMonth() !== lastReset.getMonth() || today.getFullYear() !== lastReset.getFullYear()) {
    usage = {
      ...usage,
      usedRequests: 0,
      usedMedicines: 0,
      lastReset: today.toISOString()
    };
    localStorage.setItem(`${USAGE_KEY}_${patientId}`, JSON.stringify(usage));
  }

  const remainingRequests = Math.max(0, usage.monthlyRequests - usage.usedRequests);
  const remainingMedicines = Math.max(0, usage.monthlyMedicines - usage.usedMedicines);

  return {
    plan: usage.plan,
    remainingRequests,
    remainingMedicines,
    totalRequests: usage.monthlyRequests,
    usedRequests: usage.usedRequests
  };
};

// Incrementar el contador de consultas (versión localStorage)
const incrementPatientUsageLocal = (patientId) => {
  const stored = localStorage.getItem(`${USAGE_KEY}_${patientId}`);
  let usage = stored ? JSON.parse(stored) : getDefaultUsage();

  usage.usedRequests += 1;
  localStorage.setItem(`${USAGE_KEY}_${patientId}`, JSON.stringify(usage));
  return { success: true };
};

// --- Exportaciones públicas ---
export const checkPatientLimit = async (patientId) => {
  if (USE_LAMBDA) {
    // 🔥 Cuando quieras usar Lambda, descomenta esta sección y ajusta la importación
    // const { API } = await import('aws-amplify/api');
    // const response = await API.post('checkPatientLimit', '/', { body: { patientId } });
    // return response;
    // Por ahora, fallback a localStorage
    return checkPatientLimitLocal(patientId);
  } else {
    return checkPatientLimitLocal(patientId);
  }
};

export const incrementPatientUsage = async (patientId) => {
  if (USE_LAMBDA) {
    // 🔥 Lo mismo para incrementar
    // const { API } = await import('aws-amplify/api');
    // const response = await API.post('incrementPatientUsage', '/', { body: { patientId } });
    // return response;
    return incrementPatientUsageLocal(patientId);
  } else {
    return incrementPatientUsageLocal(patientId);
  }
};