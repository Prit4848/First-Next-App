import UserModel from "@/model/User";
import dbConnection from "@/lib/dbConnection";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnection();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 },
      );
    }

    // check if user is accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is Not Accepting Messages",
        },
        { status: 403 },
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.message.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "message send successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error to send Message:", error);
    return Response.json(
      { success: false, message: "Error to send Message" },
      { status: 500 },
    );
  }
}
