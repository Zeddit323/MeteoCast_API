'use strict';

/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'reset_password_token', {
        type: Sequelize.STRING,
        allowNull: true,
    });
    await queryInterface.addColumn('Users', 'reset_password_expires', {
        type: Sequelize.DATE,
        allowNull: true,
    });
  };

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'reset_password_token');
    await queryInterface.removeColumn('Users', 'reset_password_expires');
};
