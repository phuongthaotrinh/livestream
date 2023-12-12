const userRouter = require('./user');
const roleAndPerRouter = require('./role-and-permission');
const platformRouter = require('./platform');
function route(app) {
    app.use('/api/user',userRouter);
    app.use('/api/role-per',roleAndPerRouter);
    app.use('/api/platform',platformRouter);
}
module.exports = route;