'use strict';

const { hashPassword } = require('../helpers/bcrypt');

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      fullname: 'Admin',
      username: 'admin',
      password: hashPassword('admin123'),
      jabatan: 'admin',
      nik_karyawan: '123456781',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      fullname: 'Direktur UPT Labkesda',
      username: 'direkturmasuk',
      password: hashPassword('direktur123'),
      jabatan: 'direktur_surat_masuk',
      nik_karyawan: '123456782',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      fullname: 'Kepala Subbag Tata Usaha',
      username: 'direkturkeluar',
      password: hashPassword('direktur123'),
      jabatan: 'direktur_surat_keluar',
      nik_karyawan: '123456783',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      fullname: 'Administrasi Umum',
      username: 'staffmasuk',
      password: hashPassword('staff123'),
      jabatan: 'staff_surat_masuk',
      nik_karyawan: '123456784',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      fullname: 'Staff',
      username: 'staffkeluar',
      password: hashPassword('staff123'),
      jabatan: 'staff_surat_keluar',
      nik_karyawan: '123456785',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};