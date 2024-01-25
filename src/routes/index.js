const userRouter = require('./user');
const roleAndPerRouter = require('./role-and-permission');
const platformRouter = require('./platform');
const additionalRouter = require('./additional');
const notify = require('./notify');
function route(app) {
    app.use('/api/user',userRouter);
    app.use('/api/role-per',roleAndPerRouter);
    app.use('/api/platform',platformRouter);
    app.use('/api/additional',additionalRouter);
    app.use('/api/notify',notify);
}
module.exports = route;