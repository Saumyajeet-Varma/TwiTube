import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

const verifyJwt = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // ? Alternative way to get token from header
        // const token = req.cookies?.accessToken || req.headers.authorization.split(' ')[1]

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {

            // TODO: will do some code here

            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    }
    catch (err) {
        throw new ApiError(401, err?.message || "Invalid Access Token")
    }
})

export default verifyJwt