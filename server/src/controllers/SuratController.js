const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const {
    surats,
    template_surats,
    cutis,
} = require('../models');
const moment = require('moment');
moment.locale('id'); 
const { Op } = require('sequelize');
const serverUrl = require("../helpers/serverUrl");

class SuratController {
    static async createSurat(req, res, next) {
        try {
            const {
                tipe_template_surat,
                is_important,
                deadline,
                nama_pengirim,
                jabatan_pengirim,
                alamat_pengirim,
                no_hp_pengirim,
                email_pengirim,
                nama_penerima,
                jabatan_penerima,
                alamat_penerima,
                no_hp_penerima,
                email_penerima,
                alasan_cuti,
                tanggal_surat,
                jumlah_pengecekan,
                tanggal_mulai,
                tanggal_selesai,
                nik_karyawan,
                perihal,
            } = req.body;
            if (!tanggal_surat) throw createHttpError(StatusCodes.BAD_REQUEST, 'Tanggal Surat is Required');
            if (is_important === undefined || is_important === null) {
                is_important = false;
            }
            // if ((is_important === true || is_important === 'true') && !deadline) {
            //     throw createHttpError(StatusCodes.BAD_REQUEST, 'Deadline required');
            // }
            let result = {};
            if (tipe_template_surat === 'magang' || tipe_template_surat === 'ceklab') {
                const templateSurat = await template_surats.findOne({
                    where: {
                        tipe_surat: tipe_template_surat,
                    },
                });
                console.log(req.file);
                if (!templateSurat) throw createHttpError(StatusCodes.BAD_REQUEST, 'Tipe Template Surat Tidak Ada');
                const input = {
                    user_id: req.UserData.user_id,
                    status_surat: 'dibuat',
                    tipe_template_surat: tipe_template_surat,
                    is_important: is_important,
                    tipe_surat: 'masuk',
                    jenis_surat: 'external',
                    template_surat_id: templateSurat.template_surat_id,
                    tanggal_surat: tanggal_surat,
                    perihal: perihal,
                }
                if (req.file) {
                    input.image_url = serverUrl + req.file.path;
                } else {
                    console.log('server masukk ===')
                    throw createHttpError(StatusCodes.BAD_REQUEST, 'file required');
                }
                result = await surats.create(input);
            } else if (tipe_template_surat === 'cuti') {
                const templateSurat = await template_surats.findOne({
                    where: {
                        tipe_surat: tipe_template_surat,
                    },
                });
                if (!templateSurat) throw createHttpError(StatusCodes.BAD_REQUEST, 'Tipe Template Surat Tidak Ada');
                if (!nama_pengirim,
                    !jabatan_pengirim,
                    !alamat_pengirim,
                    !no_hp_pengirim,
                    !email_pengirim,
                    !tanggal_mulai,
                    !tanggal_selesai,
                    !nama_penerima,
                    !alamat_penerima,
                    !jabatan_penerima,
                    !alasan_cuti,
                    !nik_karyawan) {
                        throw createHttpError(StatusCodes.BAD_REQUEST, 'Required All Fields');
                    }

                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                const firstDate = new Date(tanggal_mulai);
                const secondDate = new Date(tanggal_selesai);
                const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                if (diffDays > 10) {
                    throw createHttpError(StatusCodes.BAD_REQUEST, 'Jatah Cuti Sudah Habis');
                }
                const dataCuti = await cutis.findAll({
                    where: {
                        nik_karyawan: nik_karyawan,
                    }
                });
                if (dataCuti) {
                    const sumCuti = dataCuti.map(data => data.jumlah_hari).reduce((partialSum, a) => partialSum + a, 0);
                    console.log(sumCuti);
                    if ((sumCuti + diffDays) >= 10) {
                        throw createHttpError(StatusCodes.BAD_REQUEST, 'Jatah Cuti Sudah Habis');
                    }
                }
                result = await surats.create({
                    nama_pengirim: nama_pengirim,
                    jabatan_pengirim: jabatan_pengirim,
                    alamat_pengirim: alamat_pengirim,
                    no_hp_pengirim: no_hp_pengirim,
                    email_pengirim: email_pengirim,
                    tanggal_mulai: tanggal_mulai,
                    tanggal_selesai: tanggal_selesai,
                    nama_penerima: nama_penerima,
                    alamat_penerima: alamat_penerima,
                    jabatan_penerima: jabatan_penerima,
                    alasan_cuti: alasan_cuti,
                    user_id: req.UserData.user_id,
                    status_surat: 'dibuat',
                    tipe_template_surat: tipe_template_surat,
                    is_important: is_important,
                    tipe_surat: 'keluar',
                    jenis_surat: 'internal',
                    deadline: deadline,
                    template_surat_id: templateSurat.template_surat_id,
                    tanggal_surat: tanggal_surat,
                    nik_karyawan: nik_karyawan,
                    perihal: perihal,
                });
            } else if (tipe_template_surat === 'kerjasama') {
                const templateSurat = await template_surats.findOne({
                    where: {
                        tipe_surat: tipe_template_surat,
                    },
                });
                if (!templateSurat) throw createHttpError(StatusCodes.BAD_REQUEST, 'Tipe Template Surat Tidak Ada');
                if (!nama_pengirim,
                    !jabatan_pengirim,
                    !alamat_pengirim,
                    !nama_penerima,
                    !alamat_penerima,
                    !jabatan_penerima) {
                        throw createHttpError(StatusCodes.BAD_REQUEST, 'Required All Fields');
                    }
                result = await surats.create({
                    nama_pengirim: nama_pengirim,
                    jabatan_pengirim: jabatan_pengirim,
                    alamat_pengirim: alamat_pengirim,
                    nama_penerima: nama_penerima,
                    alamat_penerima: alamat_penerima,
                    jabatan_penerima: jabatan_penerima,
                    user_id: req.UserData.user_id,
                    status_surat: 'dibuat',
                    tipe_template_surat: tipe_template_surat,
                    is_important: is_important,
                    tipe_surat: 'keluar',
                    jenis_surat: 'external',
                    deadline: deadline,
                    template_surat_id: templateSurat.template_surat_id,
                    tanggal_surat: tanggal_surat,
                    perihal: perihal,
                });
            } else {
                throw createHttpError(StatusCodes.BAD_REQUEST, 'Tipe Template Surat Tidak Ada');
            }
            res.status(StatusCodes.CREATED).json({ msg: 'Success', dataSurat: result });
        } catch (err) {
            next(err);
        }
    }

    static async getSingleSurat(req, res, next) {
        try {
            const suratId = req.params.suratId;
            const dataSurat = await surats.findOne({
                where: {
                    surat_id: suratId,
                },
                include: [{
                    model: template_surats,
                    required: true,
                }],
            });
            if (!dataSurat) throw createHttpError(StatusCodes.NOT_FOUND, 'Surat not found');
            const changeWord = {
                "{nama_pengirim}": dataSurat.nama_pengirim,
                "{jabatan_pengirim}": dataSurat.jabatan_pengirim,
                "{alamat_pengirim}": dataSurat.alamat_pengirim,
                "{no_hp_pengirim}": dataSurat.no_hp_pengirim,
                "{email_pengirim}": dataSurat.email_pengirim,
                "{tanggal_mulai}": moment(dataSurat.tanggal_mulai).format('LL'),
                "{tanggal_selesai}": moment(dataSurat.tanggal_selesai).format('LL'),
                "{nama_penerima}": dataSurat.nama_penerima,
                "{jabatan_penerima}": dataSurat.jabatan_penerima,
                "{alamat_penerima}": dataSurat.alamat_penerima,
                "{tanggal_surat}": dataSurat.tanggal_surat,
                "{alasan_cuti}": dataSurat.alasan_cuti,
                "{nik_karyawan}": dataSurat.nik_karyawan,
            }
            const newTemplateSurat = dataSurat.template_surat.isi_surat.replace(/{nama_pengirim}|{jabatan_pengirim}|{alamat_pengirim}|{no_hp_pengirim}|{email_pengirim}|{tanggal_mulai}|{tanggal_selesai}|{nama_penerima}|{jabatan_penerima}|{alamat_penerima}|{tanggal_surat}|{alasan_cuti}|{nik_karyawan}/gi, function(matched){
                return changeWord[matched];
            });
            res.status(StatusCodes.OK).json({
                msg: 'Success',
                isiSurat: newTemplateSurat,
                rawDataSurat: dataSurat,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllSurat(req, res, next) {
        try {
            let {
                tipe_template_surat,
                page,
                resPerPage,
                tipe_surat,
                jenis_surat,
                is_important,
                status_surat,
            } = req.query;
            if (!page || page < 1) page = 1;
            if (!resPerPage) resPerPage = 100;
            const offset = resPerPage * page - resPerPage;
            let query = {
                where: {},
                order: [['surat_id', 'desc']],
            };
            if (req.UserData.jabatan === 'direktur_surat_masuk' || req.UserData.jabatan === 'staff_surat_masuk') {
                query.where.tipe_template_surat = {
                    [Op.in]: ['magang', 'ceklab']
                }
            } else if (req.UserData.jabatan === 'direktur_surat_keluar' || req.UserData.jabatan === 'staff_surat_keluar') {
                const temp = ['kerjasama', 'cuti'];
                if (req.UserData.jabatan === 'staff_surat_keluar') {
                    temp.push('ceklab');
                }
                query.where.tipe_template_surat = {
                    [Op.in]: temp
                }
            }
            if (tipe_template_surat) {
                query.where.tipe_template_surat = tipe_template_surat;
            }
            if (tipe_surat) {
                query.where.tipe_surat = tipe_surat;
            }
            if (jenis_surat) {
                query.where.jenis_surat = jenis_surat;
            }
            if (is_important) {
                query.where.is_important = is_important;
            }
            if (status_surat) {
                query.where.status_surat = status_surat;
            }
            const numOfResult = await surats.count(query);
            query.limit = resPerPage;
            query.offset = offset;
            const tempDataSurat = await surats.findAll(query);
            const allDataSurat = [];
            tempDataSurat.map(async (surat) => {
                if (surat.tipe_template_surat === 'cuti' && surat.user_id !== req.UserData.user_id && req.UserData.jabatan === 'staff_surat_keluar') { 
                    return false;
                } else {
                    allDataSurat.push(surat);
                }
            });
            res.status(200).json({
                msg: 'Success',
                allDataSurat: allDataSurat,
                pages: Math.ceil(numOfResult / resPerPage),
                currentPage: Number(page),
                numOfResult,
            });
        } catch (err) {
            next(err);
        }
    }

    static async changeStatusSurat(req, res, next) {
        try {
            const suratId = req.params.suratId;
            const { status_surat } = req.body;
            if (status_surat !== 'disetujui' && status_surat !== 'ditolak') {
                throw createHttpError(StatusCodes.BAD_REQUEST, 'Status Surat invalid')
            }
            const dataSurat = await surats.findOne({
                where: {
                    surat_id: suratId,
                    status_surat: 'dibuat',
                },
                include: [{
                    model: template_surats,
                    required: true,
                }],
            });
            if (!dataSurat) throw createHttpError(StatusCodes.NOT_FOUND, 'Surat not found');
            await surats.update({
                status_surat: status_surat,     
            }, {
                where: {
                    surat_id: dataSurat.surat_id,
                }
            });
            if (dataSurat.tipe_template_surat === 'cuti' && status_surat === 'disetujui') {
                const dataCuti = await cutis.findAll({
                    where: {
                        nik_karyawan: dataSurat.nik_karyawan,
                    }
                });
                if (dataCuti) {
                    const sumCuti = dataCuti.map(data => data.jumlah_hari).reduce((partialSum, a) => partialSum + a, 0);
                    if (sumCuti >= 10) {
                        throw createHttpError(StatusCodes.BAD_REQUEST, 'Jatah Cuti Sudah Habis');
                    }
                }
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                const firstDate = dataSurat.tanggal_mulai;
                const secondDate = dataSurat.tanggal_selesai;
                const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
                await cutis.create({
                    tanggal_mulai: dataSurat.tanggal_mulai,
                    tanggal_selesai: dataSurat.tanggal_selesai,
                    nik_karyawan: dataSurat.nik_karyawan,
                    jumlah_hari: diffDays,
                });
            }
            res.status(StatusCodes.OK).json({
                msg: 'Success',
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteSurat(req, res, next) {
        try {
            const suratId = req.params.suratId;
            const dataSurat = await surats.findOne({
                where: {
                    surat_id: suratId,
                },
            });
            if (!dataSurat) throw createHttpError(StatusCodes.NOT_FOUND, 'Surat not found');
            await surats.destroy({
                where: {
                    surat_id: dataSurat.surat_id,
                },
            });
            res.status(StatusCodes.OK).json({
                msg: 'Success',
            });
        } catch (err) {
            next(err);
        }
    }

    static async showSurat(req, res, next) {
        try {
            const {
                tipe_surat,
                nama_pengirim,
                jabatan_pengirim,
                alamat_pengirim,
                no_hp_pengirim,
                email_pengirim,
                tanggal_mulai,
                tanggal_selesai,
                nama_penerima,
                jabatan_penerima,
                alamat_penerima,
                tanggal_surat,
                alasan_cuti,
                nik_karyawan,
            } = req.body;
            console.log(tipe_surat);
            const templateSurat = await template_surats.findOne({
                where: {
                    tipe_surat: tipe_surat,
                }
            });
            if (!templateSurat) throw createHttpError(StatusCodes.NOT_FOUND, 'Template Not Found');
            if (tipe_surat === 'magang') {
                if (!nama_pengirim,
                    !alamat_pengirim,
                    !no_hp_pengirim,
                    !email_pengirim,
                    !tanggal_mulai,
                    !tanggal_selesai,
                    !nama_penerima,
                    !alamat_penerima,
                    !tanggal_surat) {
                        throw createHttpError(StatusCodes.BAD_REQUEST, 'Required All Fields');
                }
            } else if (tipe_surat === 'cuti') {
                if (!nama_pengirim,
                    !jabatan_pengirim,
                    !alamat_pengirim,
                    !no_hp_pengirim,
                    !email_pengirim,
                    !tanggal_mulai,
                    !tanggal_selesai,
                    !nama_penerima,
                    !alamat_penerima,
                    !jabatan_penerima,
                    !alasan_cuti,
                    !nik_karyawan) {
                    throw createHttpError(StatusCodes.BAD_REQUEST, 'Required All Fields');
                }
            }
            const changeWord = {
                "{nama_pengirim}": nama_pengirim,
                "{jabatan_pengirim}": jabatan_pengirim,
                "{alamat_pengirim}": alamat_pengirim,
                "{no_hp_pengirim}": no_hp_pengirim,
                "{email_pengirim}": email_pengirim,
                "{tanggal_mulai}": moment(tanggal_mulai).format('LL'),
                "{tanggal_selesai}": moment(tanggal_selesai).format('LL'),
                "{nama_penerima}": nama_penerima,
                "{jabatan_penerima}": jabatan_penerima,
                "{alamat_penerima}": alamat_penerima,
                "{tanggal_surat}": tanggal_surat,
                "{alasan_cuti}": alasan_cuti,
                "{nik_karyawan}": nik_karyawan,
            }
            const newTemplateSurat = templateSurat.isi_surat.replace(/{nama_pengirim}|{jabatan_pengirim}|{alamat_pengirim}|{no_hp_pengirim}|{email_pengirim}|{tanggal_mulai}|{tanggal_selesai}|{nama_penerima}|{jabatan_penerima}|{alamat_penerima}|{tanggal_surat}|{alasan_cuti}|{nik_karyawan}/gi, function(matched){
                return changeWord[matched];
            });
            res.status(StatusCodes.OK).json({
                msg: 'Success',
                isiSurat: newTemplateSurat,
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = SuratController;
