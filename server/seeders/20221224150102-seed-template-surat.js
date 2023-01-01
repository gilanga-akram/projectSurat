'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('template_surats', [{
      tipe_surat: "magang",
      isi_surat: `
      Formulir dan Pernyataan Pengajuan Surat Permohonan Pemagangan
      
      Saya yang bertanda tangan dibawah ini:

      Nama Lengkap	: {nama_pengirim}
      Alamat Asal (KTP)	: {alamat_pengirim}
      No. HP/WA		: {no_hp_pengirim}
      Email			: {email_pengirim}
      Periode Magang	: {tanggal_mulai} - {tanggal_selesai}
      Mengajukan pemagangan pada:

      Instansi		: Labkesda DKI Jakarta
      Nama Pimpinan	: {nama_penerima}
      Alamat Instansi	: {alamat_penerima}
      Dengan ini saya menyatakan dengan sungguh-sungguh, bahwa:
        Saya benar-benar akan 	mengikuti Mata Kuliah Pemagangan;
         
        Pimpinan/pejabat yang 	berwenang dalam instansi magang tersebut diatas telah mengizinkan 	saya untuk 	melakukan pemagangan mandiri 	sesuai dengan tanggal pengajuan magang dan bersedia menerapkan 	pembelajaran matakuliah pemagangan secara daring;
         
        Saya tidak akan 	mengubah permohonan pemagangan mandiri selain instansi magang 	tersebut di atas;
         
        Saya siap mematuhi 	segala peraturan pemerintah, peraturan instansi magang, termasuk dan 	tidak terbatas pada protokol kesehatan dalam Pandemi Covid-19, dan 	saya siap menerima konsekuensi bilamana saya tidak memenuhi 	pernyataan ini;
      {tanggal_surat}
      
      `,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      tipe_surat: "cuti",
      isi_surat: `Kepada Yth. {nama_penerima}
      {jabatan_penerima}
      {alamat_penerima}
      
      Yang bertanda tangan di bawah ini,
      
      Nama Lengkap	: {nama_pengirim}
      Jabatan		: {jabatan_pengirim}
      Alamat Asal (KTP)	: {alamat_pengirim}
      No. HP/WA		: {no_hp_pengirim}
      Email			: {email_pengirim}
      NIK Karyawan		: {nik_karyawan}
      
      Dengan surat ini saya mengajukan permintaan cuti dengan alasan {alasan_cuti} terhitung mulai tanggal {tanggal_mulai} sampai dengan tanggal {tanggal_selesai}.
      
      Demikianlah surat permintaan ini saya buat untuk dapat dipertimbangkan sebagaimana mestinya. Atas izin yang diberikan saya ucapkan terima kasih.
      
      Hormat saya,
      
      
      {nama_pengirim}
      {no_hp_pengirim}
      
      {tanggal_surat}
      `,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('template_surats', null, {});
  }
};