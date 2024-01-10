const { connect } = require('../dbconnect');
const Sequelize =require('sequelize');
const DataTypes= Sequelize.DataTypes;
const liveplatform = require('./LivestreamPlatform');
const user = require('./User');
async function userHasPlatform() {
    const sequelize = await connect();
    const UserHasPlatfrom = sequelize.define('user_has_platforms', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      platform_ids: {
        type: DataTypes.JSON,
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
    const LiveStreamPlatform = await liveplatform();
    const User = await user();
    UserHasPlatfrom.belongsTo(LiveStreamPlatform, { foreignKey: 'platform_id' });
    UserHasPlatfrom.belongsTo(User, { foreignKey: 'user_id' });
    await UserHasPlatfrom.sync({ force: false });
    return UserHasPlatfrom;
  }
  
module.exports = userHasPlatform;