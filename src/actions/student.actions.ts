// ============================================================
// Only registerStudentAction for now — approve/reject/update/etc.
// get added here during Phase 6. Starting this file early because
// the registration page (this phase) needs it to exist.
// ============================================================

"use server";

import { redirect } from "next/navigation";
import { studentRepo } from "@/lib/repositories/student.repo";
import { ApiError } from "@/lib/api-client";

export interface RegisterActionState {
  error: string | null;
}

export async function registerStudentAction(
  _prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");
  const phoneNumber = formData.get("phoneNumber");
  const enrollmentYear = formData.get("enrollmentYear");

  if (
    typeof firstName !== "string" || !firstName ||
    typeof lastName !== "string" || !lastName ||
    typeof email !== "string" || !email ||
    typeof password !== "string" || !password ||
    typeof phoneNumber !== "string" || !phoneNumber ||
    typeof enrollmentYear !== "string" || !enrollmentYear
  ) {
    return { error: "All fields are required" };
  }

  try {
    await studentRepo.register({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      enrollmentYear: Number(enrollmentYear),
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/login?registered=true");
}