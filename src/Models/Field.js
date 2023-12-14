const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

async function field() {
  const sequelize = await connect();
  const Field = sequelize.define('fields', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    field_data: {
      type: DataTypes.JSON,
      allowNull: false
    },
    field_value:{
      type: DataTypes.JSON,
      allowNull: true
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
  await Field.sync({ force: false });
  return Field;
}

module.exports = field;
