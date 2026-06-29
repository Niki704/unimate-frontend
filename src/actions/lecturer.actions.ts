// ============================================================
// Only registerLecturerAction for now — same note as
// student.actions.ts above.
// ============================================================

"use server";

import { redirect } from "next/navigation";
import { lecturerRepo } from "@/lib/repositories/lecturer.repo";
import { ApiError } from "@/lib/api-client";
import type { Department } from "@/types/enums";

export interface RegisterActionState {
  error: string | null;
}

const VALID_DEPARTMENTS: Department[] = ["COMPUTING", "MANAGEMENT", "COMMUNICATION", "PO"];

export async function registerLecturerAction(
  _prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");
  const phoneNumber = formData.get("phoneNumber");
  const department = formData.get("department");

  if (
    typeof firstName !== "string" || !firstName ||
    typeof lastName !== "string" || !lastName ||
    typeof email !== "string" || !email ||
    typeof password !== "string" || !password ||
    typeof phoneNumber !== "string" || !phoneNumber ||
    typeof department !== "string" || !VALID_DEPARTMENTS.includes(department as Department)
  ) {
    return { error: "All fields are required, and department must be valid" };
  }

  try {
    await lecturerRepo.register({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      department: department as Department,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/login?registered=true");
}