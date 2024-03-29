const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

async function news() {
  const sequelize = await connect();
  const News = sequelize.define('news', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
        type: DataTypes.JSON,
        allowNull: false
    },
    preview: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_link:{
        type: DataTypes.JSON,
        allowNull: false
    },
    status:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:true
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
  await News.sync({ force: false });
  return News;
}

module.exports = news;
