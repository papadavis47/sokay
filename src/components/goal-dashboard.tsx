"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Goal, Debit } from "@/types/database";

interface GoalDashboardProps {
  goal: Goal;
  debits: Debit[];
}

export function GoalDashboard({ goal, debits }: GoalDashboardProps) {
  const [foodName, setFoodName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const usedCredits = debits.length;
  const remainingCredits = goal.total_credits - usedCredits;
  const percentageUsed = (usedCredits / goal.total_credits) * 100;

  const handleDebit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      if (remainingCredits <= 0) {
        throw new Error("No credits remaining");
      }

      const { error: insertError } = await supabase
        .from("debits")
        .insert({
          goal_id: goal.id,
          user_id: user.id,
          food_name: foodName.trim(),
        });

      if (insertError) throw insertError;

      setFoodName("");
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const end = new Date(goal.end_date);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Credits Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Your Sokay Balance</CardTitle>
          <CardDescription>
            Goal period: {formatDate(goal.start_date)} - {formatDate(goal.end_date)} ({daysRemaining} days remaining)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {remainingCredits}
              </div>
              <div className="text-xl text-muted-foreground">
                credit{remainingCredits !== 1 ? 's' : ''} remaining
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {usedCredits} of {goal.total_credits} used
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>{goal.total_credits}</span>
            </div>
          </div>

          {/* Add Debit Button */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full"
                disabled={remainingCredits <= 0}
              >
                {remainingCredits > 0 ? "Log a Treat" : "No Credits Remaining"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a Treat</DialogTitle>
                <DialogDescription>
                  What did you enjoy? Be honest—this is for you, not judgment.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleDebit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foodName">Food or Drink</Label>
                  <Input
                    id="foodName"
                    placeholder="e.g., Ice cream, Soda, Cake..."
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Logging..." : "Log Treat"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {debits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your last few treats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {debits.slice(0, 5).map((debit) => (
                <div
                  key={debit.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                >
                  <span className="font-medium">{debit.food_name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(debit.debited_at)}
                  </span>
                </div>
              ))}
            </div>
            {debits.length > 5 && (
              <Button variant="link" className="w-full mt-4" asChild>
                <a href="/history">View all activity →</a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Motivational Message */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-center text-lg italic">
            {remainingCredits > goal.total_credits * 0.5
              ? "You're doing great! Keep being mindful."
              : remainingCredits > 0
              ? "You've got this. Make each credit count."
              : "Goal complete! Time to review your progress."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
