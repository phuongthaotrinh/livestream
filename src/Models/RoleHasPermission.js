const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const role = require('./Role');
const permission = require('./Permission');
async function roleHasPermission() {
  const sequelize = await connect();
  const RoleHasPermission = sequelize.define('role_has_pers', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
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
  const Role = await role();
  const Permission = await permission();
  RoleHasPermission.hasOne(Role,{foreignKey:'role_id'})
  RoleHasPermission.hasOne(Permission,{foreignKey:'permission_id'})
  await RoleHasPermission.sync({ force: false });
  return RoleHasPermission;
}

module.exports = roleHasPermission;
