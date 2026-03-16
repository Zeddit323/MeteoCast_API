'use strict';

/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cities', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        latitude: {
            type: Sequelize.DECIMAL(10, 8),
            allowNull: false
        },
        longitude: {
            type: Sequelize.DECIMAL(11, 8),
            allowNull: false
        }
    });

    await queryInterface.addIndex('Cities', ['name']);
};

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cities');
};
