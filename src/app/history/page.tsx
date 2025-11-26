import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HistoryView } from "@/components/history-view";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get active goal
  const { data: activeGoal } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!activeGoal) {
    redirect("/dashboard");
  }

  // Fetch all debits for the active goal
  const { data: debits } = await supabase
    .from("debits")
    .select("*")
    .eq("goal_id", activeGoal.id)
    .order("debited_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <HistoryView goal={activeGoal} debits={debits || []} />
    </div>
  );
}
