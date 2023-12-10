const { connect } = require('../dbconnect');
const Sequelize =require('sequelize');
const DataTypes= Sequelize.DataTypes;
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
    await UserHasRole.sync({ force: false });
    return UserHasRole;
  }
  
module.exports = userHasRole;