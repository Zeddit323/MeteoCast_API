import User from "./User.js";
import City from "./City.js";
import sequelize from "../config/db.js";

const UserCity = sequelize.define("UserCity", {}, {
    tableName: "UserCities",
    timestamps: false,
    underscored: true
})

const establishRelationship = () => {
    User.belongsToMany(City, { 
        through: UserCity,
        foreignKey: "user_id",
        otherKey: "city_id",
    });

    City.belongsToMany(User, { 
        through: UserCity,
        foreignKey: "city_id",
        otherKey: "user_id",
    });

    console.log("Relationship has been established.");
}


export { User, City, UserCity, establishRelationship };