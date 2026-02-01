"use client"

import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TextField } from "@/components/ui/text-field"
import type { ProductCategory } from "@/types/product"
import type { FormEvent, ChangeEvent } from "react"
import { Textarea } from "@/components/ui/textarea"

interface CategoryFormData {
  name: string
  description: string
}

interface CategoryFormProps {
  category?: ProductCategory
  onSuccess?: () => void
  submitLabel?: string
  onClose: () => void
}

export function CategoryForm({
  category,
  onSuccess,
  submitLabel = "Save Category",
  onClose,
}: CategoryFormProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<CategoryFormData>({
    name: category?.name || "",
    description: category?.description || "",
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const options = {
      onSuccess: () => {
        if (!category) {
          reset()
        }
        onSuccess?.()
      },
      onError: (errors: any) => {
        console.error("Form submission error:", errors)
      },
    }

    if (category) {
      put(route("categories.update", category.id), options)
    } else {
      post(route("categories.store"), options)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField isRequired>
        <Label>Category Name</Label>
        <Input
          placeholder="Enter category name"
          value={data.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setData("name", e.target.value)}
          disabled={processing}
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </TextField>

      <TextField>
        <Label>Description</Label>
        <Textarea
          placeholder="Enter category description (optional)"
          value={data.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData("description", e.target.value)}
          disabled={processing}
          rows={3}
        />
        {errors.description && <FieldError>{errors.description}</FieldError>}
      </TextField>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" intent="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isDisabled={processing} className="min-w-24">
          {processing ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
