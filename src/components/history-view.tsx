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
} from "@/components/ui/dialog";
import type { Goal, Debit } from "@/types/database";

interface HistoryViewProps {
  goal: Goal;
  debits: Debit[];
}

export function HistoryView({ goal, debits }: HistoryViewProps) {
  const [editingDebit, setEditingDebit] = useState<Debit | null>(null);
  const [foodName, setFoodName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleEdit = (debit: Debit) => {
    setEditingDebit(debit);
    setFoodName(debit.food_name);
    setError("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDebit) return;

    setError("");
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("debits")
        .update({ food_name: foodName.trim() })
        .eq("id", editingDebit.id);

      if (updateError) throw updateError;

      setEditingDebit(null);
      setFoodName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (debitId: string) => {
    if (!confirm("Are you sure you want to remove this entry?")) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("debits")
        .delete()
        .eq("id", debitId);

      if (deleteError) throw deleteError;

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const usedCredits = debits.length;
  const remainingCredits = goal.total_credits - usedCredits;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">History</h1>
        <p className="text-xl text-muted-foreground">
          All your tracked treats for the current goal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            {usedCredits} of {goal.total_credits} credits used • {remainingCredits} remaining
          </CardDescription>
        </CardHeader>
      </Card>

      {debits.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>No treats logged yet. You're doing great!</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Entries</CardTitle>
            <CardDescription>{debits.length} total entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {debits.map((debit) => (
                <div
                  key={debit.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{debit.food_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(debit.debited_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(debit)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(debit.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingDebit} onOpenChange={(open) => !open && setEditingDebit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
            <DialogDescription>
              Update what you had for this treat
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editFoodName">Food or Drink</Label>
              <Input
                id="editFoodName"
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
                onClick={() => setEditingDebit(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
