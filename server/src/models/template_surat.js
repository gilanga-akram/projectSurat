'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class template_surat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      template_surat.hasMany(models.surats, { foreignKey: 'template_surat_id' });
    }
  }
  template_surat.init({
    template_surat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipe_surat: DataTypes.STRING,
    isi_surat: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'template_surats',
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return template_surat;
};