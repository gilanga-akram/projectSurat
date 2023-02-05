'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('surats', "perihal", {
      type: Sequelize.TEXT,
    });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeColumn('surats', 'perihal');
  }
};
