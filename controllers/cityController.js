import { City, User } from "../models/index.js";
import ApiError from "../utils/apiError.js";

export const getAllCities = async (req, res) => {
    const cities = await City.findAll();

    res.status(200).json({
        status: "success",
        results: cities.length,
        data: { cities }
    });
};

export const getAllMyCities = async (req, res) => {

    const cities = await req.user.getCities();

    res.status(200).json({
        status: "success",
        results: cities.length,
        data: { cities }
    });
};


export const getMyCity = async (req, res) => {
    const { cityId } = req.params;

    const [city] = await req.user.getCities({
        where: { id: cityId },
        limit: 1
    });

    if(!city) {
        throw new ApiError("No city found with that ID.", 404);
    }

    res.status(200).json({
        status: "success",
        result: city
    });
};

export const addMyCity = async (req, res) => {
    const { name, latitude, longitude } = req.body;

    const [city, created] = await City.findOrCreate({
        where: { name: name },
        defaults: { latitude, longitude }
    })
    
    await req.user.addCity(city);

    res.status(200).json({
        status: "success",
        message: created 
            ? `New city ${city.name} added to your favorites.`
            : `City ${city.name} added to your favorites.`
    });
};

export const removeMyCity = async (req, res) => {
    const { cityId } = req.params;

    const [city] = await req.user.getCities({
        where: { id: cityId },
        limit: 1
    });

    if(!city) {
        throw new ApiError("No city found with that ID.", 404);
    }

    await req.user.removeCity(city);

    res.status(200).json({
        status: "success",
        message: `City ${city.name} removed from your favorites.`
    });
};