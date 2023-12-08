const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const livestream_platforms = require('./LivestreamPlatform');
const livestream_types = require('./LivestreamType');
const users = require('./User');
async function user() {
  const sequelize = await connect();
  const PlatformRegister = sequelize.define('platform_registers', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    totalType:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    status:{
      type:DataTypes.STRING,
      allowNull:true,
      defaultValue:"active"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  const User = await users();
  PlatformRegister.hasOne(User,{foreignKey:'user_id'});
  await PlatformRegister.sync({ force: false });
  return PlatformRegister;
}

module.exports = user;
