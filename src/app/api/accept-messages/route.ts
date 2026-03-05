import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnection from "@/lib/dbConnection";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);

  const user: User = await session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "User Not Authenticated" },
      { status: 400 },
    );
  }

  const userId = user?._id;
  const { accepMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: accepMessage },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error updating message acceptance status" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "User Not Authenticated",
    });
  }
  const userId = user?._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Accept Message",
        isAcceptingMessages: foundUser?.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error to get accept message status:", error);
    return Response.json(
      { success: false, message: "Error to get accept message status" },
      { status: 500 },
    );
  }
}
