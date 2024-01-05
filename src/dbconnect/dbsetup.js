const db = require('../dbconnect/index');
const initUserModel = require('../../src/Models/User');
const initContact = require('../Models/Contact');
const initliveStreamPlatform = require('../Models/LivestreamPlatform');
const initliveStreamType = require('../Models/LivestreamType');
const initNews = require('../Models/News');
const initNotification = require('../Models/Notification');
const initRole = require('../Models/Role');
const initUserHasRole = require('../Models/UserHasRole');
const initPermission = require('../Models/Permission');
const initRoleHasPermission = require('../Models/RoleHasPermission');
const initPlatfromRegister = require('../Models/PlatformRegister');
const initUserGroup = require('../Models/UserGroup');
const initSlide = require('../Models/Slide');
const initField = require('../Models/Field');
const initFormTempaltes = require('../Models/FormTemplates');
const initFormField = require('../Models/FormField');
const initGroup = require('../Models/Group');
async function setup() {
    const sequelize = await db.connect();
    const User = initUserModel(sequelize);
    const Slide = initSlide(sequelize);
    const Permission = initPermission(sequelize);
    const News = initNews(sequelize);
    const Contact = initContact(sequelize);
    const LiveStreamPlatform = initliveStreamPlatform(sequelize);
    const LiveStreamType = initliveStreamType(sequelize);
    const Notification = initNotification(sequelize);
    const Role = initRole(sequelize);
    const UserHasRole = initUserHasRole(sequelize);
    const RoleHasPermission = initRoleHasPermission(sequelize);
    const PlatformRegister = initPlatfromRegister(sequelize);
    const UserGroup = initUserGroup(sequelize);
    const Field = initField(sequelize);
    const FormTemplates = initFormTempaltes(sequelize);
    const FormField = initFormField(sequelize);
    const Group = initGroup(sequelize);
    await sequelize.sync({ force: false });
    return [
        User,Slide,
        Permission,News,Role,
        Contact,LiveStreamPlatform,
        LiveStreamType,Notification,
        UserHasRole,RoleHasPermission,
        PlatformRegister,UserGroup,Field,
        FormTemplates,FormField,Group
    ];
}
setup()