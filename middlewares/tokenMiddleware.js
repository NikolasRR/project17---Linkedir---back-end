import jwt from "jsonwebtoken";

async function tokenValidation (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.sendStatus(422);
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.user = user;
    } catch (error) {
        return res.send(error).status(400);
    }

    next();
}  

export default tokenValidation;