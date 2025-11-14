const swaggerAutogen = require('swagger-autogen')();

    const doc = {
      info: {
        title: 'Users Api',
        description: 'Users Api',
        
      },
      host: 'localhost:3000',
      schemes: ['https', 'http'],
      
    };
    const doc1 = {
      info: {
        title: 'Products Api',
        description: 'Products Api',
        
      },
      host: 'localhost:3000',
      schemes: ['https', 'http'],
      
    };

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

