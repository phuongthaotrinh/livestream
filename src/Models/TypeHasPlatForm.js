const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const livestream_types = require('../Models/LivestreamType');
const livestream_platforms = require('../Models/LivestreamPlatform');
async function typeHasPlatform() {
  const sequelize = await connect();
  const TypeHasPlatform = sequelize.define('type_has_platforms', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    platform_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    live_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  const LiveStreamPlatform = await livestream_platforms();
  const LiveStreamType = await livestream_types();
  TypeHasPlatform.belongsTo(LiveStreamPlatform,{foreignKey:'platform_id'})
  TypeHasPlatform.belongsTo(LiveStreamType,{foreignKey:'live_type_id'})
  await TypeHasPlatform.sync({ force: false });
  return TypeHasPlatform;
}

module.exports = typeHasPlatform;
