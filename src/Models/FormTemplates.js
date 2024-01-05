const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const livestreamType = require('../Models/LivestreamType');
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
    live_type_id:{
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
  const LivestreamType = await livestreamType();
  Form.belongsTo(LivestreamType,{foreignKey:'live_type_id'})
  await Form.sync({ force: false });
  return Form;
}

module.exports = form;
