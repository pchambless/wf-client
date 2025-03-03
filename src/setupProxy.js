const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up proxy middleware');
  
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: false,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      console.log('🔄 Proxy Request:', {
        stage: 'start',
        originalUrl: req.originalUrl,
        path: req.path,
        targetPath: proxyReq.path,
        method: req.method,
        headers: req.headers
      });
    },
    onProxyRes: (proxyRes, req) => {
      console.log('✅ Proxy Response:', {
        stage: 'complete',
        statusCode: proxyRes.statusCode,
        originalUrl: req.originalUrl,
        headers: proxyRes.headers
      });
    },
    onError: (err, req) => {
      console.error('❌ Proxy Error:', {
        message: err.message,
        originalUrl: req.originalUrl,
        stack: err.stack
      });
    }
  }));
}; 
