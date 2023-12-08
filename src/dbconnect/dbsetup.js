const db = require('../dbconnect/index');
const initUserModel = require('../../src/Models/User');
async function setup() {
    const sequelize = await db.connect();
    const User = initUserModel(sequelize);
    await sequelize.sync({ force: false });
    return [User];
}
setup()