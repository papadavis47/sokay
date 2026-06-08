import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { goals, debits } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";

const NOTES_MAX_LENGTH = 250;

function normalizeNotes(notes: string | undefined | null): string | null {
  if (notes == null) return null;
  const trimmed = notes.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > NOTES_MAX_LENGTH) {
    throw new Error(`Notes must be ${NOTES_MAX_LENGTH} characters or fewer.`);
  }
  return trimmed;
}

export const createDebit = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { goalId: string; foodName: string; notes?: string }) => data,
  )
  .handler(async ({ data }) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });

    // Hard cap: never let a user log past their goal's credit limit.
    const [goal] = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, data.goalId), eq(goals.userId, user.id)))
      .limit(1);

    if (!goal) throw new Error("Goal not found.");
    if (goal.status !== "active") {
      throw new Error("This goal is no longer active.");
    }

    const [{ used }] = await db
      .select({ used: count() })
      .from(debits)
      .where(eq(debits.goalId, goal.id));

    if (used >= goal.totalCredits) {
      throw new Error("You have used all your sokay items for this period.");
    }

    await db.insert(debits).values({
      goalId: data.goalId,
      userId: user.id,
      foodName: data.foodName,
      notes: normalizeNotes(data.notes),
    });

    return { success: true };
  });

export const updateDebit = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { debitId: string; foodName: string; notes?: string }) => data,
  )
  .handler(async ({ data }) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });

    await db
      .update(debits)
      .set({ foodName: data.foodName, notes: normalizeNotes(data.notes) })
      .where(and(eq(debits.id, data.debitId), eq(debits.userId, user.id)));

    return { success: true };
  });

export const deleteDebit = createServerFn({ method: "POST" })
  .inputValidator((data: { debitId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });

    await db
      .delete(debits)
      .where(and(eq(debits.id, data.debitId), eq(debits.userId, user.id)));

    return { success: true };
  });
