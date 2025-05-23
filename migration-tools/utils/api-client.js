/**
 * Simple adapter to fetch data from API
 */
const http = require('http');

/**
 * Direct API call implementation - no dependencies
 */
async function fetchData(eventType, params = {}) {
  console.log(`📡 Fetching data for: ${eventType}`, { params });
  
  // IMPORTANT: Keep the parameters exactly as they are - with colons
  // The server expects them in this format
  
  // Call the API directly
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      eventType,
      params  // Keep original params with colons
    });
    
    console.log('Sending request:', requestBody);
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/execEventType',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`API error ${res.statusCode}: ${data}`));
          return;
        }
        
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(requestBody);
    req.end();
  });
}

module.exports = { fetchData };
