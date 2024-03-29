const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const formTemplate = require('../Models/FormTemplates');
const fields = require('../Models/Field');
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
  const FormTemplates = await formTemplate();
  const Field = await fields();
  FormField.belongsTo(FormTemplates,{foreignKey:'form_id'});
  FormField.belongsTo(Field,{foreignKey:'field_id'});
  await FormField.sync({ force: false });
  return FormField;
}

module.exports = formField;
