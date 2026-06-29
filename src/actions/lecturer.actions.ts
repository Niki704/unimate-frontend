// ============================================================
// Server Actions for Lecturer. registerLecturerAction from Phase 4
// plus approve/reject/update/assignBatch/unassignBatch added in
// Phase 6. Same form-bound vs. plain-id split as
// student.actions.ts.
// ============================================================

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { lecturerRepo } from "@/lib/repositories/lecturer.repo";
import { ApiError } from "@/lib/api-client";
import type { Department } from "@/types/enums";

export interface RegisterActionState {
  error: string | null;
}

export interface ActionState {
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

export async function approveLecturerAction(lecturerId: number): Promise<ActionState> {
  try {
    await lecturerRepo.approve(lecturerId);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/admin/pending-approvals");
  revalidatePath("/admin/lecturers");
  return { error: null };
}

export async function rejectLecturerAction(lecturerId: number): Promise<ActionState> {
  try {
    await lecturerRepo.reject(lecturerId);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/admin/pending-approvals");
  revalidatePath("/admin/lecturers");
  return { error: null };
}

export async function updateLecturerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const lecturerId = formData.get("lecturerId");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const phoneNumber = formData.get("phoneNumber");
  const department = formData.get("department");

  if (
    typeof lecturerId !== "string" || !lecturerId ||
    typeof firstName !== "string" || !firstName ||
    typeof lastName !== "string" || !lastName ||
    typeof phoneNumber !== "string" || !phoneNumber ||
    typeof department !== "string" || !VALID_DEPARTMENTS.includes(department as Department)
  ) {
    return { error: "All fields are required, and department must be valid" };
  }

  try {
    await lecturerRepo.update(Number(lecturerId), {
      firstName,
      lastName,
      phoneNumber,
      department: department as Department,
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/lecturer/dashboard");
  revalidatePath("/admin/lecturers");
  return { error: null };
}

export async function assignLecturerBatchAction(
  lecturerId: number,
  batchId: number
): Promise<ActionState> {
  try {
    await lecturerRepo.assignBatch(lecturerId, batchId);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/admin/lecturers");
  revalidatePath("/admin/batches");
  return { error: null };
}

export async function unassignLecturerBatchAction(
  lecturerId: number,
  batchId: number
): Promise<ActionState> {
  try {
    await lecturerRepo.unassignBatch(lecturerId, batchId);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/admin/lecturers");
  revalidatePath("/admin/batches");
  return { error: null };
}