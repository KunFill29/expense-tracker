// src/components/budget-overview.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface BudgetOverviewProps {
  totalBudget: number;
  totalExpenses: number;
  savingsGoal: number; // e.g., amount saved or percentage (0-100)
  topCategory: {
    name: string;
    amount: number;
  };
}

export default function BudgetOverview({
  totalBudget,
  totalExpenses,
  savingsGoal,
  topCategory,
}: BudgetOverviewProps) {
  const budgetRemaining = Math.max(totalBudget - totalExpenses, 0);
  const budgetPercentLeft = (budgetRemaining / totalBudget) * 100;

  return (
    <section className="grid md:grid-cols-4 gap-6 mb-12">
      <Card className="rounded-xl bg-white/95 shadow-sm hover:shadow-lg transition">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-900 uppercase text-xs tracking-widest">
            Total Budget
          </CardDescription>
          <CardTitle className="text-3xl font-bold">
            ${totalBudget.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">Your monthly budget</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-white/95 shadow-sm hover:shadow-lg transition">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-900 uppercase text-xs tracking-widest">
            Expenses
          </CardDescription>
          <CardTitle className="text-3xl font-bold text-red-600">
            ${totalExpenses.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">Total spent this month</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-white/95 shadow-sm hover:shadow-lg transition">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs tracking-widest">
            Budget Remaining
          </CardDescription>
          <CardTitle className="text-3xl font-bold text-green-600">
            ${budgetRemaining.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">
            {budgetPercentLeft.toFixed(0)}% of budget left
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-white/95 shadow-sm hover:shadow-lg transition">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs tracking-widest">
            Top Category
          </CardDescription>
          <CardTitle className="text-3xl font-bold">
            {topCategory.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">
            ${topCategory.amount.toFixed(2)} spent
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-white/95 shadow-sm hover:shadow-lg transition">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs tracking-widest">
            Savings Goal
          </CardDescription>
          <CardTitle className="text-3xl font-bold text-blue-600">
            {savingsGoal}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">$780 of $1000</p>
        </CardContent>
      </Card>
    </section>
  );
}
