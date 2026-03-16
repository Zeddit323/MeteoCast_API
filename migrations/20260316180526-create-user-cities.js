'use strict';

/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserCities', {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        city_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Cities',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        }
    });
    // Create a composite primary key so a user can't add the same city twice
    await queryInterface.addConstraint('UserCities', {
        fields: ['user_id', 'city_id'],
        type: 'primary key',
        name: 'user_cities_pkey'
    })
};

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserCities');
};

