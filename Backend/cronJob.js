const https = require('http');

const sendBulkNotifications = () => {
  const postData = JSON.stringify({});
  
  const options = {
    hostname: process.env.HOST_NAME || 'localhost',
    port: process.env.CONTAINER_PORT || 3008,
    path: '/api/awmp/send-bulk-expiry-notifications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Bulk notification response:', JSON.parse(data));
    });
  });

  req.on('error', (error) => {
    console.error('Error sending bulk notifications:', error);
  });

  req.write(postData);
  req.end();
};

// Run immediately if called directly
if (require.main === module) {
  sendBulkNotifications();
}

module.exports = { sendBulkNotifications };