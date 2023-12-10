const { connect } = require('../dbconnect');
const Sequelize =require('sequelize');
const DataTypes= Sequelize.DataTypes;
const role = require('./Role');
const user = require('./User');
async function userHasRole() {
    const sequelize = await connect();
    const UserHasRole = sequelize.define('user_has_roles', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:"on"
      },
      createdAt:{
        type:DataTypes.DATE,
        allowNull: true
      },
      updatedAt:{
        type: DataTypes.DATE,
        allowNull: true
      }
    },{
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    });
    const Role = await role();
    const User = await user();
    UserHasRole.belongsTo(Role, { foreignKey: 'role_id' });
    UserHasRole.belongsTo(User, { foreignKey: 'user_id' });
    await UserHasRole.sync({ force: false });
    return UserHasRole;
  }
  
module.exports = userHasRole;