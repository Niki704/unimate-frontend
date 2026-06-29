// ============================================================
// Server Actions for Student. registerStudentAction from Phase 4
// plus approve/reject/update added in Phase 6.
// approve/update are form-bound (multi-field); reject is a
// plain single-id action — the calling UI can bind it via
// .bind(null, studentId) on a form, or call it directly via
// startTransition from a button.
// ============================================================

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { studentRepo } from "@/lib/repositories/student.repo";
import { ApiError } from "@/lib/api-client";
import { getSessionUser } from "@/lib/session";

export interface RegisterActionState {
  error: string | null;
}

export interface ActionState {
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

export async function approveStudentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Expects a hidden <input type="hidden" name="studentId" .../>
  // inside the approve form, alongside the visible batchId/
  // studentIdNumber fields.
  const studentId = formData.get("studentId");
  const batchId = formData.get("batchId");
  const studentIdNumber = formData.get("studentIdNumber");

  if (
    typeof studentId !== "string" || !studentId ||
    typeof batchId !== "string" || !batchId ||
    typeof studentIdNumber !== "string" || !studentIdNumber
  ) {
    return { error: "Batch and student ID number are required" };
  }

  const admin = await getSessionUser();
  if (!admin) {
    return { error: "You must be signed in to do this." };
  }

  try {
    await studentRepo.approve(Number(studentId), {
      batchId: Number(batchId),
      studentIdNumber,
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/admin/pending-approvals");
  revalidatePath("/admin/students");
  return { error: null };
}

export async function rejectStudentAction(studentId: number): Promise<ActionState> {
  try {
    await studentRepo.reject(studentId);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/admin/pending-approvals");
  revalidatePath("/admin/students");
  return { error: null };
}

export async function updateStudentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Expects a hidden studentId field, same reasoning as approve above.
  const studentId = formData.get("studentId");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const phoneNumber = formData.get("phoneNumber");
  const enrollmentYear = formData.get("enrollmentYear");

  if (
    typeof studentId !== "string" || !studentId ||
    typeof firstName !== "string" || !firstName ||
    typeof lastName !== "string" || !lastName ||
    typeof phoneNumber !== "string" || !phoneNumber ||
    typeof enrollmentYear !== "string" || !enrollmentYear
  ) {
    return { error: "All fields are required" };
  }

  try {
    await studentRepo.update(Number(studentId), {
      firstName,
      lastName,
      phoneNumber,
      enrollmentYear: Number(enrollmentYear),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/student/profile");
  revalidatePath("/admin/students");
  return { error: null };
}