// code away!
require('dotenv').config();
const server = require('./server');

// console.log(process.env);

const port = process.env.PORT || 4000;
console.log("port", port);

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`)
});