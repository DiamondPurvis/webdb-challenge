const server = require('./api/server.js');

const port = 8020;
server.listen(port, () => {
    console.log(`\n* API running on ${port} *\n`);
}); 