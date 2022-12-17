const {
	users
} = require('../models');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { Op } = require("sequelize");

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
			const { username, fullname, jabatan, nik_karyawan } = req.body;
			if (!username || !fullname || !jabatan || !nik_karyawan) throw createError(StatusCodes.BAD_REQUEST, "Fill in all required fields");
			const userValidation = await users.findOne({ where: { username } });
			if (userValidation) throw createError(StatusCodes.BAD_REQUEST, "Username Already Taken");
			await users.create({
				fullname: fullname,
				username: username,
				password: hashPassword('123456'),
				jabatan: jabatan,
				nik_karyawan: nik_karyawan,
			});
			res.status(StatusCodes.CREATED).json({ msg: 'Success' });
		} catch (err) {
			next(err);
		}
	}
	static async listUser(req, res, next) {
		try {
			if (req.UserData.jabatan !== 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'must be an admin');
			}
    		const userData = await users.findAll({
				where: {
					jabatan: {
						[Op.ne]: 'admin',
					}
				}
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
			const { fullname, jabatan } = req.body;
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
			if (jabatan) Object.assign(updateQuery, { jabatan: jabatan });
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
      		const userData = await users.findOne({
				where: {
					user_id: req.UserData.user_id,
				},
			});
			if (userData.jabatan === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be edited');
			}
			await users.update({
				password: hashPassword('123456')
			}, {
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
};

module.exports = UserController;