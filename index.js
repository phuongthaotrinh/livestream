const path = require('path');
const dotenv = require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const Logger = require('./logger');
require('./src/dbconnect/dbsetup');
require('./src/utils/Cronjob');
var cors = require('cors');
const app = express();
const route = require('./src/routes');
app.use(express.json());
const publicPath = path.join(__dirname, 'src', 'public');
app.use("/photo", express.static(publicPath));
app.use(
    express.urlencoded({
      extended: true,
    }),
);
app.use(cors({
    origin:['*'],
}));
route(app);
app.use((err, req, res, next) => {
    Logger.error(`Error: ${err.message}`, { error: err });
    next(err);
});
const node_port = process.env.PORT;
const node_host = process.env.NODE_HOST;
app.listen(node_port,node_host, () => {
    console.log(`Server Started at ${node_port}`)
})