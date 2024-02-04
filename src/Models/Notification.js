const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const group = require('./Group');
const user = require('./User');
const DataTypes = Sequelize.DataTypes;

async function notification() {
  const sequelize = await connect();
  const Notification = sequelize.define('notifications', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group_id:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:"unread"
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
  const GRoup = await group();
  const User = await user();
   Notification.belongsTo(GRoup,{foreignKey:'group_id'});
   Notification.belongsTo(User,{foreignKey:'user_id'});
  await Notification.sync({ force: false });
  return Notification;
}

module.exports = notification;
