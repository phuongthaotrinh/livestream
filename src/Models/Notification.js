const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
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
    image_link:{
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id:{
        type: DataTypes.JSON,
        allowNull: false
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
  await Notification.sync({ force: false });
  return Notification;
}

module.exports = notification;
