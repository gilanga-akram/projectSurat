'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class surat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      surat.belongsTo(models.template_surats, { foreignKey: 'template_surat_id', targetKey: 'template_surat_id' });
    }
  }
  surat.init({
    surat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipe_template_surat: DataTypes.STRING,
    template_surat_id: DataTypes.INTEGER,
    tipe_surat: DataTypes.STRING,
    jenis_surat: DataTypes.STRING,
    is_important: DataTypes.BOOLEAN,
    status_surat: DataTypes.STRING,
    deadline: DataTypes.DATE,
    nama_pengirim: DataTypes.STRING,
    jabatan_pengirim: DataTypes.STRING,
    alamat_pengirim: DataTypes.STRING,
    no_hp_pengirim: DataTypes.STRING,
    email_pengirim: DataTypes.STRING,
    nama_penerima: DataTypes.STRING,
    jabatan_penerima: DataTypes.STRING,
    alamat_penerima: DataTypes.STRING,
    no_hp_penerima: DataTypes.STRING,
    email_penerima: DataTypes.STRING,
    tanggal_surat: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    alasan_cuti: DataTypes.STRING,
    jumlah_pengecekan: DataTypes.INTEGER,
    tanggal_mulai: DataTypes.DATE,
    tanggal_selesai: DataTypes.DATE,
    nik_karyawan: DataTypes.STRING,
    image_url: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'surats',
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return surat;
};