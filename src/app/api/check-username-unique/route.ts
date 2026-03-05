import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidationSchema } from "@/Schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidationSchema,
});

export async function GET(request: Request) {
  await dbConnection();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 },
      );
    }

    const { username } = result.data;

    const isusernameExist = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (isusernameExist) {
      return Response.json(
        {
          success: false,
          message: "User name is Alredy Taken",
        },
        {
          status: 400,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is Unique",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error Checking name", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 },
    );
  }
}
