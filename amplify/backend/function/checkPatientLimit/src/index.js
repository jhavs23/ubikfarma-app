// amplify/backend/function/checkPatientLimit/src/index.js
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const TABLE_NAME = 'PatientUsage';

exports.handler = async (event) => {
  try {
    // Recibir el patientId desde el evento
    const patientId = event.arguments?.patientId || event.patientId;

    if (!patientId) {
      throw new Error('patientId is required');
    }

    // Obtener el registro de uso
    const params = {
      TableName: TABLE_NAME,
      Key: { patient_id: patientId }
    };
    let result = await dynamodb.get(params).promise();
    let usage = result.Item;

    // Si no existe, crear uno por defecto
    if (!usage) {
      usage = {
        patient_id: patientId,
        plan: 'FREE',
        monthly_requests: 2,
        used_requests: 0,
        monthly_medicines: 4,
        used_medicines: 0,
        last_reset: new Date().toISOString()
      };
      await dynamodb.put({ TableName: TABLE_NAME, Item: usage }).promise();
    }

    // Reset mensual si es necesario
    const today = new Date();
    const lastReset = new Date(usage.last_reset);
    if (today.getMonth() !== lastReset.getMonth() || today.getFullYear() !== lastReset.getFullYear()) {
      usage.used_requests = 0;
      usage.used_medicines = 0;
      usage.last_reset = today.toISOString();
      await dynamodb.put({ TableName: TABLE_NAME, Item: usage }).promise();
    }

    const remainingRequests = Math.max(0, usage.monthly_requests - usage.used_requests);
    const remainingMedicines = Math.max(0, usage.monthly_medicines - usage.used_medicines);

    return {
      plan: usage.plan,
      remainingRequests,
      remainingMedicines,
      totalRequests: usage.monthly_requests,
      usedRequests: usage.used_requests,
      subscriptionEnd: usage.subscription_end || null
    };
  } catch (error) {
    console.error('Error in checkPatientLimit:', error);
    throw error;
  }
};