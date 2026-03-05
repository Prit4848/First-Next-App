import UserModel from "@/model/User";
import dbConnection from "@/lib/dbConnection";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User Not Exist",
        },
        { status: 400 },
      );
    }

    const isCorrectCode = user.verifyCode.toString() == code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCorrectCode) {
      return Response.json(
        {
          success: true,
          message: "Verify Code Successfully",
        },
        { status: 200 },
      );
    }else if(!isCodeNotExpired){
        return Response.json(
      {
        success: false,
        message: "Code is Expired",
      },
      { status: 400 },
    );
    }else{
        return Response.json(
      {
        success: false,
        message: "Invalid Code",
      },
      { status: 400 },
    );
    }
  } catch (error) {
    console.log("Error Checking name", error);
    return Response.json(
      {
        success: false,
        message: "Error Vrify Code",
      },
      { status: 500 },
    );
  }
}
