const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const liveStreamPlatform = require('../Models/LivestreamPlatform');
async function form() {
  const sequelize = await connect();
  const Form  = sequelize.define('forms', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform_id:{
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
  const LiveStreamPlatform = await liveStreamPlatform();
  Form.belongsTo(LiveStreamPlatform,{foreignKey:'platform_id'})
  await Form.sync({ force: false });
  return Form;
}

module.exports = form;
