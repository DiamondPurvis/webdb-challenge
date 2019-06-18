const express = require('express');
const helmet = require('helmet');

const actionRouter = require('../action/actionRouter.js');
const projectRouter = require('../project/projectRouter.js');

const server = express();

server.use(express.json());
server.use(helmet());

server.use('/api/action', actionRouter);
server.use('/api/project', projectRouter);


//check
server.get('/', (req, res) => {
    res.send('Hello World!')
});


module.exports = server; 