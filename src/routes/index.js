const userRouter = require('./user');
const roleAndPerRouter = require('./role-and-permission');
function route(app) {
    app.use('/api/user',userRouter);
    app.use('/api/role-per',roleAndPerRouter);
}
module.exports = route;