const { connect } = require('../dbconnect');
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

async function slide() {
  const sequelize = await connect();
  const Slide = sequelize.define('slides', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    image_link:{
        type: DataTypes.STRING,
        allowNull:false
    },
    position:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
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
  await Slide.sync({ force: false });
  return Slide;
}

module.exports = slide;
