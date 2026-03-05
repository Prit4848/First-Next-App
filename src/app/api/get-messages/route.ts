import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import { User } from "next-auth";
import UserModel from "@/model/User";
import { success } from "zod";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "User is Not Authenticated",
    });
  }

  const userId = new mongoose.Schema.Types.ObjectId(user?._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user) {
      return Response.json(
        { success: false, message: "user not found" },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "get all Messages",
        messages: user[0].messages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error to get Messages:", error);
    return Response.json(
      { success: false, message: "Error to get Messages" },
      { status: 500 },
    );
  }
}
