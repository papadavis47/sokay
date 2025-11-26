"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Goal, Debit } from "@/types/database";

interface GoalReviewProps {
  goal: Goal;
  debits: Debit[];
}

export function GoalReview({ goal, debits }: GoalReviewProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const usedCredits = debits.length;
  const remainingCredits = goal.total_credits - usedCredits;
  const successRate = ((goal.total_credits - usedCredits) / goal.total_credits) * 100;

  const handleComplete = async () => {
    setLoading(true);

    try {
      // Mark goal as completed
      const { error } = await supabase
        .from("goals")
        .update({ status: "completed" })
        .eq("id", goal.id);

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDurationLabel = (months: number) => {
    if (months === 1) return "1 month";
    if (months === 12) return "1 year";
    return `${months} months`;
  };

  const getMessage = () => {
    if (successRate >= 80) {
      return {
        title: "Outstanding! 🌟",
        message: "You showed incredible discipline and mindfulness. You should be very proud of yourself!",
      };
    } else if (successRate >= 50) {
      return {
        title: "Great Job! 👏",
        message: "You maintained good balance and stayed mindful of your choices. Keep it up!",
      };
    } else if (successRate >= 20) {
      return {
        title: "Good Effort! 💪",
        message: "You completed the journey and learned about your habits. That's progress!",
      };
    } else {
      return {
        title: "You Finished! 🎯",
        message: "Completing a goal is an achievement in itself. Now you know what to work on next time.",
      };
    }
  };

  const { title, message } = getMessage();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Goal Complete!</h1>
        <p className="text-xl text-muted-foreground">
          Review your progress
        </p>
      </div>

      {/* Results Card */}
      <Card className="border-primary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">
              {remainingCredits}
            </div>
            <div className="text-xl text-muted-foreground">
              credits remaining out of {goal.total_credits}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {usedCredits} treats logged
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{successRate.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Credits Saved</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{getDurationLabel(goal.duration_months)}</div>
              <div className="text-sm text-muted-foreground">Goal Duration</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{usedCredits}</div>
              <div className="text-sm text-muted-foreground">Treats Logged</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-muted-foreground">Started</p>
                <p className="font-medium">{formatDate(goal.start_date)}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Ended</p>
                <p className="font-medium">{formatDate(goal.end_date)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Common Treats */}
      {debits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Treats</CardTitle>
            <CardDescription>What you enjoyed during this goal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {debits.slice(0, 10).map((debit) => (
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
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="text-center text-muted-foreground">
            Ready to start a new goal and continue your journey?
          </p>
          <Button
            onClick={handleComplete}
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Completing..." : "Complete Goal & Start Fresh"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
