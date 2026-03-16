import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const City = sequelize.define(
    'City',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
            validate: {
                min: -90,
                max: 90,
            }
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
            validate: {
                min: -180,
                max: 180,
            }
        },
    },
    {
        underscored: true,
        timestamps: false,
        tableName: 'Cities',
        indexes: [
            { fields: ['name'] }
        ]
    }
);

export default City;