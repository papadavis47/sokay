import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoalSetupForm } from "@/components/goal-setup-form";
import { GoalDashboard } from "@/components/goal-dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check for active goal
  const { data: activeGoal } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  // Check for goal that needs review
  const { data: reviewGoal } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "reviewing")
    .single();

  if (reviewGoal) {
    redirect(`/goal/review/${reviewGoal.id}`);
  }

  if (!activeGoal) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Sokay!</h1>
          <p className="text-xl text-muted-foreground">
            Let&apos;s set up your first goal
          </p>
        </div>
        <GoalSetupForm />
      </div>
    );
  }

  // Fetch debits for the active goal
  const { data: debits } = await supabase
    .from("debits")
    .select("*")
    .eq("goal_id", activeGoal.id)
    .order("debited_at", { ascending: false });

  return (
    <GoalDashboard goal={activeGoal} debits={debits || []} />
  );
}
