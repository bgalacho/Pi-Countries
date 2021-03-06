const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('activity', {
    id:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    difficulty:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    duration:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    season:{
        type: DataTypes.ENUM("summer","winter","fall","spring"),
        allowNull: false,
    },
  })
}
