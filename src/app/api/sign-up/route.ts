import dbConnection from "@/lib/dbConnection";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, email, password } = await request.json();

    const isUserExistWithUsenameandVerifield = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (isUserExistWithUsenameandVerifield) {
      return Response.json(
        {
          success: false,
          message: "Username Alredy Taken",
        },
        { status: 400 },
      );
    }
    const verifyCode = Math.floor(100000 + Math.random() * 9000000).toString();
    const isUserEmailExist = await UserModel.findOne({
      email,
    });
    if (isUserEmailExist) {
      if (isUserEmailExist.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User Alredy Exist With This Email",
          },
          { status: 400 },
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        isUserEmailExist.password = hashPassword;
        isUserEmailExist.verifyCode = verifyCode;
        isUserEmailExist.verifyCodeExpiry = new Date(Date.now() * 360000);

        await isUserEmailExist.save();
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 360000);
      const newUser = new UserModel({
        email,
        password: hashPassword,
        username,
        verifyCode,
        veryfyCodeExpiry: expiry,
        isVerified: false,
        isAcceptingMessage: false,
        message: [],
      });

      await newUser.save();
    }

    const mailsend = await sendVerificationEmail(email, username, verifyCode);

    if (!mailsend.success) {
      return Response.json({
        success: false,
        message: mailsend.message,
      });
    }

    return Response.json(
      {
        success: false,
        message: "User Register Successfully, Please Verify Your Email",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error Register User", error);
    return Response.json(
      {
        success: false,
        message: "Error Register Email",
      },
      {
        status: 500,
      },
    );
  }
}
