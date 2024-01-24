const { connect } = require('../dbconnect');
const Sequelize =require('sequelize');
const DataTypes= Sequelize.DataTypes;
const user = require('./User');
const permission = require('./Permission');
async function userHasPer() {
    const sequelize = await connect();
    const UserHasPer = sequelize.define('user_has_pers', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      permission_id: {
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
    const Permission = await permission();
    const User = await user();
    UserHasPer.belongsTo(Permission, { foreignKey: 'permission_id' });
    UserHasPer.belongsTo(User, { foreignKey: 'user_id' });
    await UserHasPer.sync({ force: false });
    return UserHasPer;
  }
  
module.exports = userHasPer;