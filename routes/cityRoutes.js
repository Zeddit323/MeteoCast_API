import express from "express";
import {
    getAllCities,
    getAllMyCities,
    getMyCity,
    addMyCity,
    removeMyCity
} from "../controllers/cityController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', getAllCities);

router.use(protect);
router.route('/me')
    .get(getAllMyCities)
    .post(addMyCity);

router.route('/me/:cityId')
    .get(getMyCity)
    .delete(removeMyCity);

export default router;

