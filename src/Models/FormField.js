const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

async function formField() {
  const sequelize = await connect();
  const FormField  = sequelize.define('form_fields', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    field_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    field_order:{
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
  await FormField.sync({ force: false });
  return FormField;
}

module.exports = formField;
