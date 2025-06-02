"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const mailer_1 = require("../helpers/mailer");
const prisma_2 = require("../../generated/prisma");
class AuthController {
    async register(req, res) {
        var _a;
        try {
            const { username, email, password, role } = req.body;
            if (!username || !email || !password || !role) {
                res.status(400).send({ message: "All fields are required" });
                return;
            }
            const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
            if (existingUser) {
                res.status(409).send({ message: "Email already registered" });
                return;
            }
            const salt = await (0, bcrypt_1.genSalt)(10);
            const hashedPassword = await (0, bcrypt_1.hash)(password, salt);
            const referralCode = [...Array(8)]
                .map(() => Math.random().toString(36).charAt(2).toUpperCase())
                .join('');
            const referredCode = req.body.referralCode;
            let referredById = null;
            if (referredCode) {
                const referredByUser = await prisma_1.default.user.findFirst({
                    where: { referralCode: referredCode },
                    select: { id: true },
                });
                referredById = (_a = referredByUser === null || referredByUser === void 0 ? void 0 : referredByUser.id) !== null && _a !== void 0 ? _a : null;
            }
            const user = await prisma_1.default.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    role,
                    referralCode, // field referralCode ini seharusnya bertipe string
                    referredBy: referredById, // number | null, sesuai skema Prisma
                },
            });
            if (typeof referredById === "number") {
                // misalnya kamu sudah punya referralId (id dari entitas Referral yang relevan)
                const referral = await prisma_1.default.referral.create({
                    data: {
                        referrerId: referredById,
                        referredUserId: user.id,
                    }
                });
                const pointVal = parseInt(process.env.REFERRAL_POINT || '0', 10);
                const monthsToAdd = parseInt(process.env.REFERRAL_POINT_AGE || '0', 10);
                const expiresAt = new Date();
                expiresAt.setMonth(expiresAt.getMonth() + monthsToAdd);
                await prisma_1.default.point.create({
                    data: {
                        userId: referredById,
                        points: pointVal,
                        earnedFromId: referral.id,
                        expiresAt: expiresAt, // contoh: kadaluarsa dalam 30 hari
                    },
                });
            }
            //token untuk regustrasi
            const payload = { id: user.id };
            const token = (0, jsonwebtoken_1.sign)(payload, process.env.SECRET_KEY_VERIFY, { expiresIn: "10m" });
            const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
            await prisma_1.default.email_verifications.create({
                data: { userId: user.id, token, expiredAt },
            });
            const templatePath = path_1.default.join(__dirname, "../templates", "verify.hbs");
            if (!fs_1.default.existsSync(templatePath)) {
                res.status(500).send({ message: "Email template not found" });
                return;
            }
            const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
            const compiledTemplate = handlebars_1.default.compile(templateSource);
            const html = compiledTemplate({
                username: user.username,
                link: `http://localhost:3000/verify?token=${token}`
            });
            await mailer_1.transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: user.email,
                subject: "Verify Email",
                html,
            });
            res.status(201).send({ message: "Register OK" });
        }
        catch (err) {
            console.error("Register error:", err);
            res.status(500).send({ message: "Internal server error", error: err });
        }
    }
    async login(req, res) {
        try {
            const { login, password } = req.body;
            const user = await prisma_1.default.user.findFirst({
                where: {
                    OR: [
                        { username: login },
                        { email: login }
                    ]
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    password: true,
                    avatar: true,
                    isVerified: true,
                    role: true,
                }
            });
            if (!user) {
                res.status(404).send({ message: "User not found" });
                return;
            }
            const isPasswordValid = await (0, bcrypt_1.compare)(password, user.password);
            if (!isPasswordValid) {
                res.status(401).send({ message: "Invalid password" });
                return;
            }
            if (!user.isVerified) {
                res.status(402).send({ message: "Account not verified, please check your confirmation email !" });
                return;
            }
            const payload = { id: user.id, role: user.role };
            const token = (0, jsonwebtoken_1.sign)(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
            // Hapus password dari response
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            res.status(200).send({
                message: "Login OK",
                user: userWithoutPassword,
                token
            });
        }
        catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }
    async verify(req, res) {
        var _a, _b;
        try {
            const { id } = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user;
            const token = (_b = res.locals) === null || _b === void 0 ? void 0 : _b.token;
            const data = await prisma_1.default.email_verifications.findFirst({
                where: { token, userId: id },
            });
            if (!data)
                throw { message: "Invalid link verification " };
            await prisma_1.default.user.update({
                data: { isVerified: true },
                where: { id },
            });
            await prisma_1.default.email_verifications.delete({
                where: { id: data.id }
            });
            res.status(200).send({ message: "Verification Successfully" });
        }
        catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
    async getRole(req, res) {
        try {
            const roles = Object.values(prisma_2.Role).slice(1);
            res.status(200).json(roles);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ error: 'Failed to get roles', detail: err });
        }
    }
    async referralValidation(req, res) {
        try {
            const { code } = req.query;
            const user = await prisma_1.default.user.findUnique({
                where: { referralCode: code },
            });
            res.status(200).json({ valid: !!user });
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ error: 'Referral Code is invalid', detail: err });
        }
    }
}
exports.AuthController = AuthController;
/**
 curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Soqi",
    "email": "sogilu@logsmarter.net",
    "password": "Asd@123456"
  }'


 curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "budi5@gmail.com",
    "password": "123456"
  }'



   curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Andi6",
    "email": "budi6@gmail.com",
    "password": "asd123456"
  }'
  */ 
