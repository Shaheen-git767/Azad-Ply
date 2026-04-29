const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../../.env')
});
console.log('BASE_URL:', process.env.BASE_URL);
