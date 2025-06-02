"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenVerification = exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (reg, res, next) => {
    var _a;
    const token = (_a = reg.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // "Bearer kjdfsak" -> [Bearer, kjdfsak]
    if (!token) {
        res.status(401).send({ message: "Unauthorized" });
        return;
    }
    (0, jsonwebtoken_1.verify)(token, process.env.SECRET_KEY, (err, palyload) => {
        if (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                res.status(401).send({ message: "Token expired" });
            }
            else {
                res.status(401).send({ message: "Unauthorized" });
            }
            return;
        }
        res.locals.user = palyload;
        next();
    });
};
exports.verifyToken = verifyToken;
const verifyTokenVerification = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // "Bearer kjdfsak" -> [Bearer, kjdfsak]
    if (!token) {
        res.status(401).send({ message: "Unauthorized" });
        return;
    }
    (0, jsonwebtoken_1.verify)(token, process.env.SECRET_KEY_VERIFY, (err, palyload) => {
        if (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                res.status(401).send({ message: "Token expired" });
            }
            else {
                res.status(401).send({ message: "Unauthorized" });
            }
            return;
        }
        res.locals.user = palyload;
        res.locals.token = token;
        next();
    });
};
exports.verifyTokenVerification = verifyTokenVerification;
