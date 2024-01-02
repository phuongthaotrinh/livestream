const user = require('./src/Models/User');
const role = require('./src/Models/Role');
const permission = require('./src/Models/Permission');
const roleHasPermission = require('./src/Models/RoleHasPermission');
const userHasRole = require('./src/Models/UserHasRole');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { Sequelize } = require('sequelize');
 const createAdmin = async() =>{
    console.log(process.env.DB_NAME)
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
      });
    try {
        const User = await user()
        const Role = await role()
        const Permission = await permission()
        const RoleHasPermission = await roleHasPermission();
        const UserHasRole = await userHasRole()
        const saltRounds = 10;
        const afterhashPass = await bcrypt.hash('admin@12345', saltRounds);
        /// create use account 
        const buildUser = User.build({
            name:"admin",
            fullName:"Admin account",
            email:"admin@gmail.com",
            password:afterhashPass
        })
        await buildUser.save();
        /// create role
        const buildRole = Role.build({
            name:"admin"
        })
        const saveBuildRole = await buildRole.save();
        /// create permissons 
        const buildPermission = Permission.build({
            name:"all"
        })
        const savebuildPermission = await buildPermission.save();
        // assing permission for role
        if(savebuildPermission && saveBuildRole){
            const buildRoleHasPer = RoleHasPermission.build({
                role_id:1,
                permission_id:1
            })
        const saveBuildRoleHasPer = await buildRoleHasPer.save();
        if(saveBuildRoleHasPer){
            const buildUserRole = UserHasRole.build({
                user_id:1,
                role_id:1
            })
            await buildUserRole.save();
        }
        }
    } catch (error) {
        console.log(error)
    }
}
createAdmin();