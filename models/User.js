import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: { isEmail: true },
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_login: {
            type: DataTypes.DATE,
        }
    },
    {
        underscored: true,
        timestamps: true,
        tableName: 'Users',
        defaultScope: {
            attributes: { exclude: ['password_hash'] },
        },
        scopes: {
            withPassword: { attributes: {}, }
        },
        indexes: [
            { fields: ['email'] }
        ]
    }
);

User.addHook('beforeSave', async (user) => {
    if(user.changed('password_hash')){
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
});
User.prototype.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
};

export default User;