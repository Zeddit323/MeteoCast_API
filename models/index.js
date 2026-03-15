import User from "./User.js";
import City from "./City.js";


const establishRelationship = () => {
    User.belongsToMany(City, { 
    through: "UserCities",
    foreignKey: "user_id",
    otherKey: "city_id",
    });

    City.belongsToMany(User, { 
        through: "UserCities",
        foreignKey: "city_id",
        otherKey: "user_id",
    });

    console.log("Relationship has been established.");
}


export { User, City, establishRelationship };