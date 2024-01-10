const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const user = require('../Models/User');
const field = require('../Models/Field');
async function form_field_data() {
  const sequelize = await connect();
  const FormFieldData = sequelize.define('form_field_datas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    field_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    field_data: {
      type: DataTypes.JSON,
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
  const User = await user();
  const Field = await field();
  FormFieldData.belongsTo(User,{foreignKey:'user_id'})
  FormFieldData.belongsTo(Field,{foreignKey:'field_id'})
  await FormFieldData.sync({ force: false });
  return FormFieldData;
}

module.exports = form_field_data;
