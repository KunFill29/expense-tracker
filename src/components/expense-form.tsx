// src/components/expense-form.tsx
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, DollarSign, Tag, Type, Info } from "lucide-react"
import { ExpenseCategory } from "@/types"

const expenseSchema = z.object({
  title: z.string()
    .min(1, "Please enter a title for your expense")
    .max(50, "Title must be less than 50 characters")
    .transform(val => val.trim()),
  amount: z.number()
    .min(0.01, "Amount must be greater than $0.01")
    .max(1000000, "Amount seems unusually high")
    .transform(val => Number(val.toFixed(2))),
  date: z.string()
    .min(1, "Please select a date")
    .refine(date => new Date(date) <= new Date(), {
      message: "Date cannot be in the future"
    }),
  category: z.enum(["food", "transportation", "entertainment", "utilities", "shopping", "health", "education", "other"] as const, {
    required_error: "Please select a category"
  }),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  onAddExpense: (data: ExpenseFormData) => void
  onCancel: () => void
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      await onAddExpense(data)
      reset()
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const categories = [
    { value: "food" as ExpenseCategory, label: "Food & Dining", description: "Restaurants, groceries, and food delivery" },
    { value: "transportation" as ExpenseCategory, label: "Transportation", description: "Gas, public transit, and car maintenance" },
    { value: "entertainment" as ExpenseCategory, label: "Entertainment", description: "Movies, games, and leisure activities" },
    { value: "utilities" as ExpenseCategory, label: "Utilities", description: "Electricity, water, internet, and phone bills" },
    { value: "shopping" as ExpenseCategory, label: "Shopping", description: "Clothing, electronics, and general purchases" },
    { value: "health" as ExpenseCategory, label: "Health & Medical", description: "Doctor visits, medications, and insurance" },
    { value: "education" as ExpenseCategory, label: "Education", description: "Courses, books, and educational materials" },
    { value: "other" as ExpenseCategory, label: "Other", description: "Miscellaneous expenses" },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Title Field */}
        <div className="relative">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Expense Title
            <span className="text-gray-400 ml-1 text-xs">(required)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Type className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="title"
              {...register("title")}
              className={`pl-10 w-full rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm text-gray-800 font-medium tracking-wide placeholder:text-gray-400 placeholder:font-normal transition-all duration-200 ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="e.g., Grocery shopping at Walmart"
            />
          </div>
          {errors.title && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{errors.title.message}</span>
            </div>
          )}
        </div>

        {/* Amount Field */}
        <div className="relative">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
            <span className="text-gray-400 ml-1 text-xs">(required)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              {...register("amount", { valueAsNumber: true })}
              className={`pl-10 w-full rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm text-gray-800 font-medium tracking-wide placeholder:text-gray-400 placeholder:font-normal transition-all duration-200 ${
                errors.amount ? "border-red-500" : ""
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{errors.amount.message}</span>
            </div>
          )}
        </div>

        {/* Date Field */}
        <div className="relative">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
            <span className="text-gray-400 ml-1 text-xs">(required)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="date"
              max={new Date().toISOString().split('T')[0]}
              {...register("date")}
              className={`pl-10 w-full rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm text-gray-800 font-medium tracking-wide transition-all duration-200 ${
                errors.date ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.date && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{errors.date.message}</span>
            </div>
          )}
        </div>

        {/* Category Field */}
        <div className="relative">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
            <span className="text-gray-400 ml-1 text-xs">(required)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="category"
              {...register("category")}
              className={`pl-10 w-full rounded-md border-gray-300 bg-white/95 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm text-gray-800 font-medium tracking-wide transition-all duration-200 ${
                errors.category ? "border-red-500" : ""
              }`}
            >
              <option value="" className="text-gray-400 font-normal">Select a category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value} className="text-gray-800">
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{errors.category.message}</span>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 flex items-start">
            <Info className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
            <span>Select the most appropriate category for better expense tracking and insights</span>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 font-medium"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding Expense..." : "Add Expense"}
        </Button>
      </div>
    </form>
  )
}

export default ExpenseForm
