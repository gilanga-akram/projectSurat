const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const {
    surat,
} = require('../models');

class SuratController {
    static async createSurat(req, res, next) {
        try {
            const { role, bagian, id } = req.UserData;
            if (role === 'admin') throw createHttpError(StatusCodes.FORBIDDEN, 'admin cannot create surat');
            const { no_surat, asal_surat, tgl_surat, isi, tipe, jenis, tujuan, waktu_pengiriman } = req.body;
            if (!tipe || !jenis) throw createHttpError(StatusCodes.BAD_REQUEST, 'Tipe dan Jenis surat wajib diisi');
            if (!no_surat || !tgl_surat) throw createHttpError(StatusCodes.BAD_REQUEST, 'nomor dan tanggal surat wajib diisi');
            if (jenis !== 'internal' && jenis !== 'external') throw createHttpError(StatusCodes.BAD_REQUEST, 'Jenis surat salah');
            if (jenis === 'internal') {
                if (!asal_surat && tipe === 'surat cuti') throw createHttpError(StatusCodes.BAD_REQUEST, 'Asal surat wajib diisi');
                if (tipe === 'disposisi' && (!tujuan || !waktu_pengiriman)) {
                    throw createHttpError(StatusCodes.BAD_REQUEST, 'Tujuan dan Waktu pengiriman wajib diisi');
                }

                if (tipe === 'surat pemberitahuan' && (bagian !== 'Administrasi Umum' && bagian !== 'Direktur UPT Lapkesda')) {
                    throw createHttpError(StatusCodes.FORBIDDEN, 'bukan bagian anda');
                } else if (tipe === 'surat cuti' && bagian !== 'Staff') {
                    throw createHttpError(StatusCodes.FORBIDDEN, 'bukan bagian anda');
                } else if (tipe === 'disposisi' && bagian !== 'Kepala Subbag Tata Usaha') {
                    throw createHttpError(StatusCodes.FORBIDDEN, 'bukan bagian anda');
                } else {
                    throw createHttpError(StatusCodes.BAD_REQUEST, 'Tipe Surat Salah');
                }
            } else if (jenis === 'external') {
                if (!asal_surat && tipe === 'cek kesehatan') throw createHttpError(StatusCodes.BAD_REQUEST, 'Asal surat wajib diisi');
                
                if (tipe === 'cek kesehatan' && (bagian !== 'Administrasi Umum' && bagian !== 'Direktur UPT Lapkesda')) {
                    throw createHttpError(StatusCodes.FORBIDDEN, 'bukan bagian anda');
                } else {
                    throw createHttpError(StatusCodes.BAD_REQUEST, 'Tipe Surat Salah');
                }
            }

            await surat.create({
                id_user: id,
                no_surat: no_surat,
                asal_surat: asal_surat,
                tgl_surat: tgl_surat,
                isi: isi,
                status: 'PUBLISHED',
                tipe: tipe,
                jenis: jenis,
            });
            res.status(StatusCodes.CREATED).json({ msg: 'Success' });
        } catch (err) {
            next(err);
        }
    }

};

module.exports = SuratController;
