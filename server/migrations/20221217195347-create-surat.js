'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('surats', {
      surat_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipe_template_surat: {
        type: Sequelize.STRING
      },
      template_surat_id: {
        type: Sequelize.INTEGER
      },
      tipe_surat: {
        type: Sequelize.STRING
      },
      jenis_surat: {
        type: Sequelize.STRING
      },
      is_important: {
        type: Sequelize.BOOLEAN
      },
      status_surat: {
        type: Sequelize.STRING
      },
      deadline: {
        type: Sequelize.DATE
      },
      nama_pengirim: {
        type: Sequelize.STRING
      },
      jabatan_pengirim: {
        type: Sequelize.STRING
      },
      alamat_pengirim: {
        type: Sequelize.STRING
      },
      no_hp_pengirim: {
        type: Sequelize.STRING
      },
      email_pengirim: {
        type: Sequelize.STRING
      },
      nama_penerima: {
        type: Sequelize.STRING
      },
      jabatan_penerima: {
        type: Sequelize.STRING
      },
      alamat_penerima: {
        type: Sequelize.STRING
      },
      no_hp_penerima: {
        type: Sequelize.STRING
      },
      email_penerima: {
        type: Sequelize.STRING
      },
      tanggal_surat: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      alasan_cuti: {
        type: Sequelize.STRING
      },
      jumlah_pengecekan: {
        type: Sequelize.INTEGER
      },
      tanggal_mulai: {
        type: Sequelize.DATE
      },
      tanggal_selesai: {
        type: Sequelize.DATE
      },
      nik_karyawan: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('surats');
  }
};