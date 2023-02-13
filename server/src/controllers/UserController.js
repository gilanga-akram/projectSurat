const {
	users,
	surats,
	cutis,
} = require('../models');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { Op } = require("sequelize");
const groupBy = require('../helpers/groupBy');

class UserController {
	static async loginUser(req, res, next) {
		try {
			const { username, password } = req.body;
			if (!username || !password) throw createError(StatusCodes.BAD_REQUEST, "Wrong Username / Password");
			const userValidation = await users.findOne({ where: { username } });
			if (!userValidation) throw createError(StatusCodes.BAD_REQUEST, "Wrong Username / Password");
			if (!comparePassword(password, userValidation.password)) throw createError(StatusCodes.BAD_REQUEST, "Wrong Username / Password");
			let result = {
				access_token: generateToken({ user_id: userValidation.user_id, jabatan: userValidation.jabatan, fullname: userValidation.fullname }),
				user_data: userValidation,
			};
			res.status(StatusCodes.OK).json(result);
		} catch (err) {
			next(err);
		}
	}
	static async registerUser(req, res, next) {
		try {
			if (req.UserData.jabatan !== 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'must be an admin');
			}
			const { username, fullname, jabatan } = req.body;
			if (!username || !fullname || !jabatan ) throw createError(StatusCodes.BAD_REQUEST, "Fill in all required fields");
			const userValidation = await users.findOne({ where: { username } });
			if (userValidation) throw createError(StatusCodes.BAD_REQUEST, "Username Already Taken");
			await users.create({
				fullname: fullname,
				username: username,
				password: hashPassword('123456'),
				jabatan: jabatan,
			});
			res.status(StatusCodes.CREATED).json({ msg: 'Success' });
		} catch (err) {
			next(err);
		}
	}
	static async listUser(req, res, next) {
		try {
			const { search } = req.query;
			if (req.UserData.jabatan !== 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'must be an admin');
			}
			const where = {
				jabatan: {
					[Op.ne]: 'admin',
				}
			};
			if (search) {
				Object.assign(where, {
					[Op.or]: [
						{ username: { [Op.iLike]: `%${search}%` } },
						{ fullname: { [Op.iLike]: `%${search}%` } }
					]
				})
			}
    		const userData = await users.findAll({
				where: where,
			});
      		res.status(StatusCodes.OK).json({
				data: userData,
			});
		} catch (err) {
			next(err);
		}
	}
	static async deleteUser(req, res, next) {
		try {
			if (req.UserData.jabatan !== 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'must be an admin');
			}
      		const userData = await users.findOne({
				where: {
					user_id: req.params.id,
				},
			});
			if (!userData) throw createError(StatusCodes.NOT_FOUND, 'user not found');
			if (userData.jabatan === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be deleted');
			}
			await users.destroy({
				where: {
					user_id: userData.user_id,
				},
			});
      		res.status(StatusCodes.OK).json({
				msg: 'Success',
			});
		} catch (err) {
			next(err);
		}
	}
	static async editUser(req, res, next) {
		try {
			const { fullname } = req.body;
			if (req.UserData.jabatan !== 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'must be an admin');
			}
      		const userData = await users.findOne({
				where: {
					user_id: req.params.id,
				},
			});
			if (!userData) throw createError(StatusCodes.NOT_FOUND, 'user not found');
			if (userData.jabatan === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be edited');
			}
			const updateQuery = {};
			if (fullname) Object.assign(updateQuery, { fullname: fullname });
			await users.update(updateQuery, {
				where: {
					user_id: req.params.id,
				}
			});
      		res.status(StatusCodes.OK).json({
				msg: 'Success',
			});
		} catch (err) {
			next(err);
		}
	}
	static async changePassword(req, res, next) {
		try {
			const { oldPassword, newPassword } = req.body;
      		const userData = await users.findOne({
				where: {
					user_id: req.UserData.user_id,
				},
			});
			if (userData.jabatan === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be edited');
			}
			if (!comparePassword(oldPassword, userData.password)) throw createError(StatusCodes.BAD_REQUEST, "Wrong Password");
			const updateQuery = {};
			if (newPassword) Object.assign(updateQuery, { password: hashPassword(newPassword) });
			await users.update(updateQuery, {
				where: {
					user_id: req.UserData.user_id,
				}
			});
      		res.status(StatusCodes.OK).json({
				msg: 'Success',
			});
		} catch (err) {
			next(err);
		}
	}
	static async resetPassword(req, res, next) {
		try {
			const { id } = req.params;
      		const userData = await users.findOne({
				where: {
					user_id: id,
				},
			});
			if (userData.jabatan === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be edited');
			}
			await users.update({
				password: hashPassword('123456')
			}, {
				where: {
					user_id: id,
				}
			});
      		res.status(StatusCodes.OK).json({
				msg: 'Success',
			});
		} catch (err) {
			next(err);
		}
	}

	static async forgotPassword(req, res, next) {
		try {
			const { username } = req.params;
      		const userData = await users.findOne({
				where: {
					username: username,
				},
			});
			if (!userData) throw createError(StatusCodes.NOT_FOUND, 'user not found');
			if (userData.jabatan === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be edited');
			}
			await users.update({
				password: hashPassword('123456')
			}, {
				where: {
					user_id: userData.user_id,
				}
			});
      		res.status(StatusCodes.OK).json({
				msg: 'Success',
			});
		} catch (err) {
			next(err);
		}
	}

	static async listCuti(req, res, next) {
		try {
			let result = []
			const where = {
				tipe_template_surat: 'cuti',
				status_surat: 'disetujui',
			}
			if (req.query.nik) {
				where.nik_karyawan = { [Op.iLike]: `%${req.query.nik}%` };
			}
			const dataSurat = await surats.findAll({
				where: where,
			});
			if (!dataSurat) {
				res.status(StatusCodes.OK).json([]);
				return;
			}
			const groupData = groupBy(dataSurat, 'nik_karyawan');
			const key = Object.keys(groupData);
			const dataCuti = await cutis.findAll({
				where: {
					nik_karyawan: {
						[Op.in]: key,
					}
				}
			});
			const resultTemp = [];
			dataCuti.reduce(function(res, value) {
				if (!res[value.nik_karyawan]) {
					res[value.nik_karyawan] = { nik_karyawan: value.nik_karyawan, jumlah_hari: 0 };
					resultTemp.push(res[value.nik_karyawan])
				}
				res[value.nik_karyawan].jumlah_hari += value.jumlah_hari;
				return res;
			}, {});
			result = resultTemp.map((data, idx) => {
				const nama_karyawan = dataSurat.filter((surat) => surat.nik_karyawan === data.nik_karyawan);
				return {
					...data,
					id: idx + 1,
					nama_karyawan: nama_karyawan[0].dataValues.nama_pengirim,
				}
			});
      		res.status(StatusCodes.OK).json(result);
		} catch (err) {
			next(err);
		}
	}

	static async sisaCuti(req, res, next) {
		try {
			const userId = req.UserData.user_id;
			let sisaCuti = 10;
			let totalCuti = 0;
			const suratData = await surats.findOne({
				where: {
					nik_karyawan: {
						[Op.ne]: null,
					},
					user_id: userId,
					tipe_template_surat: 'cuti',
					status_surat: 'disetujui',
				}
			});
			if (suratData) {
				const nikKaryawan = suratData.nik_karyawan;
				const cutiData = await cutis.findAll({
					where: {
						nik_karyawan: nikKaryawan,
					}
				});
				totalCuti = cutiData.reduce((a, b) => a + (b.jumlah_hari || 0), 0);
				sisaCuti = 10 - totalCuti;
			}
			res.status(StatusCodes.OK).json({
				sisaCuti: sisaCuti,
				totalCuti: totalCuti,
			});
		} catch (err) {
			next(err);
		}
	}
};

module.exports = UserController;