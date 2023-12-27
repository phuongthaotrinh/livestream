const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const role = require('./Role');
const user = require('./User');
const group = require('./Group');
async function userGroup() {
  const sequelize = await connect();
  const UserGroup = sequelize.define('user_group', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    child_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    group_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:"on"
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
  // const Role = await role();
  const User = await user();
  const Group = await group();
  UserGroup.belongsTo(User, { foreignKey: 'child_id' });
  UserGroup.belongsTo(User, { foreignKey: 'parent_id' });
  UserGroup.belongsTo(Group,{foreignKey: 'group_id'});
  await UserGroup.sync({ force: false });
  return UserGroup;
}

module.exports = userGroup;