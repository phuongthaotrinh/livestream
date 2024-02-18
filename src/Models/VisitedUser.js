const { connect } = require('../dbconnect');
const Sequelize =require('sequelize');
const DataTypes= Sequelize.DataTypes;
const role = require('./Role');
const user = require('./User');
async function visitedUser() {
    const sequelize = await connect();
    const VisitedUser = sequelize.define('visted_users', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    const User = await user();
    VisitedUser.belongsTo(User, { foreignKey: 'user_id' });
    await VisitedUser.sync({ force: false });
    return VisitedUser;
  }
  
module.exports = visitedUser;