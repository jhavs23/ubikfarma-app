// amplify/backend/function/incrementPatientUsage/src/index.js
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const TABLE_NAME = 'PatientUsage';

exports.handler = async (event) => {
  try {
    const patientId = event.arguments?.patientId || event.patientId;

    if (!patientId) {
      throw new Error('patientId is required');
    }

    // Obtener el registro actual
    const params = {
      TableName: TABLE_NAME,
      Key: { patient_id: patientId }
    };
    let result = await dynamodb.get(params).promise();
    let usage = result.Item;

    if (!usage) {
      // Si no existe, crear uno por defecto con 1 consulta usada
      usage = {
        patient_id: patientId,
        plan: 'FREE',
        monthly_requests: 2,
        used_requests: 1,
        monthly_medicines: 4,
        used_medicines: 0,
        last_reset: new Date().toISOString()
      };
    } else {
      // Incrementar contador de consultas
      usage.used_requests = (usage.used_requests || 0) + 1;
    }

    await dynamodb.put({ TableName: TABLE_NAME, Item: usage }).promise();

    return {
      success: true,
      patientId,
      usedRequests: usage.used_requests,
      remainingRequests: Math.max(0, usage.monthly_requests - usage.used_requests)
    };
  } catch (error) {
    console.error('Error in incrementPatientUsage:', error);
    throw error;
  }
};