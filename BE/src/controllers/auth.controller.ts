import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import { transporter } from "../helpers/mailer";
import { Role } from "../../generated/prisma";


export class AuthController{
  async register(req: Request, res: Response) {
      try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
          res.status(400).send({ message: "All fields are required" });
          return; 
        }
    
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          res.status(409).send({ message: "Email already registered" });
          return;
        }
    
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        const referralCode = [...Array(8)]
          .map(() => Math.random().toString(36).charAt(2).toUpperCase())
          .join('');
        

        const referredCode: string | undefined = req.body.referralCode;

        let referredById: number | null = null;

        if (referredCode) {
          const referredByUser = await prisma.user.findFirst({
            where: { referralCode: referredCode },
            select: { id: true },
          });

          referredById = referredByUser?.id ?? null;

        }


        const user = await prisma.user.create({
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
          const referral = await prisma.referral.create({
            data: {
              referrerId: referredById,
              referredUserId: user.id,
            }
          });

          const pointVal = parseInt(process.env.REFERRAL_POINT || '0', 10);
          const monthsToAdd = parseInt(process.env.REFERRAL_POINT_AGE || '0', 10);
          const expiresAt = new Date();
                            expiresAt.setMonth(expiresAt.getMonth() + monthsToAdd);

          
          await prisma.point.create({
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
        const token = sign(payload, process.env.SECRET_KEY_VERIFY!, { expiresIn: "10m" });
    
        const expiredAt = new Date (Date.now() + 10 * 60 * 1000)
        await prisma.email_verifications.create({
            data: {userId: user.id, token, expiredAt},
        });

        const templatePath = path.join(__dirname, "../templates", "verify.hbs");
        if (!fs.existsSync(templatePath)) {
          res.status(500).send({ message: "Email template not found" });
          return;
        }
    
        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = Handlebars.compile(templateSource);
        const html = compiledTemplate({
          username: user.username,
          link: `${process.env.EMAI_VERIFICATION_URL}/verify?token=${token}`
        });
    
        await  transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: user.email,
          subject: "Verify Email",
          html,
        });
    
        res.status(201).send({ message: "Register OK" });
      } catch (err) {
        console.error("Register error:", err);
        res.status(500).send({ message: "Internal server error", error: err });
      }
    }
  

    // async login(req: Request, res: Response) {
    //   try {
    //     const { login, password } = req.body;
  
    //     const user = await prisma.user.findFirst({
    //       where: {
    //         OR: [
    //           { username: login },
    //           { email: login }
    //         ]
    //       },
    //       select: {
    //         id: true,
    //         username: true,
    //         email: true,
    //         password: true,
    //         avatar: true,
    //         isVerified: true,
    //         role: true,
    //         referralCode: true,
    //         points: true,
    //       }
    //     });
  
    //     if (!user) {
    //       res.status(404).send({ message: "User not found" });
    //       return;
    //     }
  
    //     const isPasswordValid = await compare(password, user.password);
    //     if (!isPasswordValid) {
    //       res.status(401).send({ message: "Invalid password" });
    //       return;
    //     }

    //     if (!user.isVerified) {
    //       res.status(402).send({ message: "Account not verified, please check your confirmation email !" });
    //       return;
    //     } 
  
    //     const payload = { id: user.id, role: user.role };
    //     const token = sign(payload, process.env.SECRET_KEY!, { expiresIn: "1h" });

  
    //     // Hapus password dari response
    //     const { password: _, ...userWithoutPassword } = user;
  
    //     res.status(200).send({
    //       message: "Login OK",
    //       user: userWithoutPassword,
    //       token
    //     });
  
    //   } catch (err) {
    //     console.error("Query error:", err);
    //     res.status(500).send({ message: "Internal error", error: err });
    //   }
    // }

    async login(req: Request, res: Response) {
      try {
        const { login, password } = req.body;

        const user = await prisma.user.findFirst({
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
            referralCode: true,
            // Jangan ambil points langsung (array), akan kita jumlahkan terpisah
          }
        });

        if (!user) {
          res.status(404).send({ message: "User not found" });
          return;
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          res.status(401).send({ message: "Invalid password" });
          return;
        }

        if (!user.isVerified) {
          res.status(402).send({ message: "Account not verified, please check your confirmation email!" });
          return;
        }

        // Ambil total points user dari tabel Point
        const now = new Date();
        const pointSummary = await prisma.point.aggregate({
          where: { 
            userId: user.id,
            redeemed: false,
            expiresAt: { gt: now },
          },
          _sum: {
            points: true,
          },
        });

        const totalPoints = pointSummary._sum.points ?? 0;

        const payload = { id: user.id, role: user.role };
        const token = sign(payload, process.env.SECRET_KEY!, { expiresIn: "1h" });

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).send({
          message: "Login OK",
          user: {
            ...userWithoutPassword,
            points: totalPoints,
          },
          token
        });

      } catch (err) {
        console.error("Query error:", err);
        res.status(500).send({ message: "Internal error", error: err });
      }
    }


    async verify(req: Request, res: Response){
      try{
        const { id } = res.locals?.user;
        const token  = res.locals?.token;

        const data = await prisma.email_verifications.findFirst({
          where: {token, userId: id},
        })

        if(!data) throw {message: "Invalid link verification "};

        await prisma.user.update({
          data: {isVerified: true},
          where: {id},
        })

        await prisma.email_verifications.delete({
          where: {id: data.id}
        });

        res.status(200).send({message: "Verification Successfully"});

      }catch(err){
        console.log(err);
        res.status(400).send(err);
      }
    }

  async getRole(req: Request, res: Response) {
     try {
        const roles = Object.values(Role).slice(1);
        res.status(200).json(roles);
      }catch(err){
        console.log(err);
        res.status(400).send({ error: 'Failed to get roles', detail: err });
      }     
  }


  async referralValidation(req: Request, res: Response) {
     try {
        const { code } = req.query;

        const user = await prisma.user.findUnique({
          where: { referralCode: code as string },
        });

        res.status(200).json({ valid: !!user });
      }catch(err){
        console.log(err);
        res.status(400).send({ error: 'Referral Code is invalid', detail: err });
      }     
  }

}


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