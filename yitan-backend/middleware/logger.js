const morgan = require('morgan');

const logger = morgan((tokens, req, res) => {
  return [
    `[${new Date().toLocaleString()}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    `状态码: ${tokens.status(req, res)}`,
    `响应时间: ${tokens['response-time'](req, res)}ms`,
    req.body && Object.keys(req.body).length > 0 
      ? `请求体: ${JSON.stringify(req.body)}` 
      : ''
  ].join(' ');
});

module.exports = logger;