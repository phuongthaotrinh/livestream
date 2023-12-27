const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const user = require('../Models/User');
async function group() {
  const sequelize = await connect();
  const Group  = sequelize.define('groups', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name:{
       type:DataTypes.STRING,
       allowNull:false,
    },
    user_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
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
  },{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  const User = await user();
  Group.belongsTo(User, { foreignKey: 'user_id' });
  await Group.sync({ force: false });
  return Group;
}

module.exports = group;