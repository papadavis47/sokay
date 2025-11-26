"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DurationMonths } from "@/types/database";

export function GoalSetupForm() {
  const [credits, setCredits] = useState([10]);
  const [duration, setDuration] = useState<DurationMonths>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + duration);

      const { error: insertError } = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
          total_credits: credits[0],
          duration_months: duration,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: "active",
        });

      if (insertError) throw insertError;

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getDurationLabel = (months: number) => {
    if (months === 1) return "1 month";
    if (months === 12) return "1 year";
    return `${months} months`;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Set Your Sokay Goal</CardTitle>
        <CardDescription>
          Choose how many treats you&apos;ll allow yourself and for how long.
          Remember, this is about balance, not restriction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Sokay Credits</Label>
                <span className="text-2xl font-bold text-primary">{credits[0]}</span>
              </div>
              <Slider
                value={credits}
                onValueChange={setCredits}
                min={5}
                max={20}
                step={1}
                className="py-4"
              />
              <p className="text-sm text-muted-foreground">
                You can enjoy up to {credits[0]} treat{credits[0] !== 1 ? 's' : ''} during your goal period.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Goal Duration</Label>
              <Select
                value={duration.toString()}
                onValueChange={(value) => setDuration(parseInt(value) as DurationMonths)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{getDurationLabel(1)}</SelectItem>
                  <SelectItem value="2">{getDurationLabel(2)}</SelectItem>
                  <SelectItem value="3">{getDurationLabel(3)}</SelectItem>
                  <SelectItem value="6">{getDurationLabel(6)}</SelectItem>
                  <SelectItem value="12">{getDurationLabel(12)}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Your goal will run for {getDurationLabel(duration)}.
              </p>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Your Goal Summary</p>
            <p className="text-sm text-muted-foreground">
              I will track my treats and limit myself to <strong>{credits[0]} sokay credits</strong> over the next <strong>{getDurationLabel(duration)}</strong>.
              I&apos;m building a healthier relationship with food, one mindful choice at a time.
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating goal..." : "Start My Journey"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
