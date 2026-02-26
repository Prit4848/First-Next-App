import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEmail";
import { ApiResponse } from "@/types/ApiREsponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: `${process.env.FROM_MAIL}`,
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({username,otp:verifyCode}),
    });
    return { success: false, message: "Verification Mail Send Successfully" };
  } catch (error) {
    console.log("Error Sending Verification Email", error);
    return { success: false, message: "Error Sending Verification Email" };
  }
}
