const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;


        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        const token =
            authHeader.split(" ")[1];


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        const user =
            await User.findById(decoded.id);


        if (!user) {

            return res.status(401).json({
                message: "User account not found"
            });

        }


        req.user = user;

        next();


    } catch (error) {

        console.log(
            "User Auth Error:",
            error
        );


        return res.status(401).json({
            message:
                "Invalid or expired authentication token"
        });

    }

};


module.exports = userAuth;