const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const livestream_platforms = require('./LivestreamPlatform');
const livestream_types = require('./LivestreamType');
const users = require('./User');
const formTemplate = require('./FormTemplates');
const formField = require('./FormField');
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
    form_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    form_field_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    status:{
      type:DataTypes.STRING,
      allowNull:true,
      defaultValue:"active"
    },
    additional_status:{
      type:DataTypes.STRING,
      allowNull:true,
      defaultValue:"pending"
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
  const FormField = await formField();
  const FormTemplates = await formTemplate();
  User.hasMany(PlatformRegister, { foreignKey: 'user_id' });
  PlatformRegister.belongsTo(User,{foreignKey:'user_id'});
  PlatformRegister.belongsTo(FormTemplates,{foreignKey:'form_id'});
  PlatformRegister.belongsTo(FormField,{foreignKey:'form_field_id'})
  await PlatformRegister.sync({ force: false });
  return PlatformRegister;
}

module.exports = user;
