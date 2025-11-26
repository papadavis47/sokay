import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoalReview } from "@/components/goal-review";

export default async function GoalReviewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const goalId = (await params).id;

  // Get the goal
  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("id", goalId)
    .eq("user_id", user.id)
    .single();

  if (!goal) {
    redirect("/dashboard");
  }

  // Fetch all debits for this goal
  const { data: debits } = await supabase
    .from("debits")
    .select("*")
    .eq("goal_id", goal.id)
    .order("debited_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <GoalReview goal={goal} debits={debits || []} />
    </div>
  );
}
