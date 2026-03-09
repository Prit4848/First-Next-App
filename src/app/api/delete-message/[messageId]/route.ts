import dbConnection from "@/lib/dbConnection";
import userModel, { User } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ messageId: string }> },
) {
  try {
    const { messageId } = await context.params;
    await dbConnection();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "User Not Authenticated",
        },
        { status: 401 },
      );
    }

    const updateResult = await userModel.updateOne(
      { _id: user._id },
      { $pull: { message: { _id: messageId } } },
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "Message deleted ...", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error to get Messages:", error);
    return Response.json(
      { success: false, message: "Error to Message Delete" },
      { status: 500 },
    );
  }
}
