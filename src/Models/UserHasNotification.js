const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

async function user_has_notification() {
  const sequelize = await connect();
  const UserHasNotification = sequelize.define('user_has_notifications', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groupId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    notificationId:{
        type: DataTypes.INTEGER,
        allowNull: false,
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
  await UserHasNotification.sync({ force: false });
  return UserHasNotification;
}

module.exports = user_has_notification;
