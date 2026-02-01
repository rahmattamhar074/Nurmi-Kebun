"use client";

import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Description, FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FileTrigger } from "@/components/ui/file-trigger";
import type { Product, ProductCategory } from "@/types/product";
import { useState, useEffect } from "react";
import type { Key } from "react-aria-components";
import { toast } from "sonner";

interface ProductFormProps {
  product?: Product;
  categories: ProductCategory[];
  onSuccess?: () => void;
  onClose?: () => void;
  submitLabel?: string;
}

export function ProductForm({
  product,
  categories,
  onSuccess,
  onClose,
  submitLabel = "Create Product",
}: ProductFormProps) {
  const initialSelectedCategories = product?.categories
    ? product.categories.map((cat) => String(cat.id) as Key)
    : product?.product_category_id
    ? [String(product.product_category_id) as Key]
    : [];

  const [selectedCategories, setSelectedCategories] = useState<Key[]>(
    initialSelectedCategories
  );
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images || []
  );

  const { data, setData, post, processing, errors, reset } = useForm({
    product_code: product?.product_code || "",
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    weight: product?.weight || 0,
    notes: product?.notes || "",
    category_ids: initialSelectedCategories.map((id) => Number(id)),
    thumbnail: null as File | null,
    images: null as File[] | null,
    existing_images: product?.images || [],
    removed_images: [] as string[],
    _method: undefined as string | undefined,
  });

  useEffect(() => {
    const categoryIds = initialSelectedCategories.map((id) => Number(id));
    setSelectedCategories(initialSelectedCategories);
    setData("category_ids", categoryIds);
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const options = {
      forceFormData: true,
      onSuccess: () => {
        if (!product) {
          reset();
          setSelectedCategories([]);
        }
        onSuccess?.();
        product
          ? toast.success("Product updated successfully")
          : toast.success("Product created successfully");
      },
      onError: (errors: any) => {
        console.log("Validation errors:", errors);
        const firstErrorKey = Object.keys(errors)[0];
        const errorMessage = firstErrorKey
          ? errors[firstErrorKey]
          : "An error occurred. Please check the form.";
        toast.error(errorMessage);
      },
    };

    if (product) {
      setData("_method", "PUT");
      post(route("products.update", product.id), options);
    } else {
      post(route("products.store"), options);
    }
  };

  useEffect(() => {
    setData(
      "category_ids",
      Array.from(selectedCategories).map((id) => Number(id))
    );
  }, [selectedCategories]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Product Code</Label>
          <Description>Enter a unique code for the product</Description>
          <Input
            type="text"
            value={data.product_code}
            onChange={(e) => setData("product_code", e.target.value)}
            placeholder="e.g., IPH-15-PRO-001"
            required
          />
          {errors.product_code && (
            <FieldError>{errors.product_code}</FieldError>
          )}
        </div>

        <div className="space-y-2">
          <Label>Product Name</Label>
          <Description>Enter the name of the product</Description>
          <Input
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            placeholder="e.g., iPhone 15 Pro"
            required
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Description>Provide a detailed description of the product</Description>
        <Textarea
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
          placeholder="Enter product description..."
          rows={4}
        />
        {errors.description && <FieldError>{errors.description}</FieldError>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Weight (grams)</Label>
          <Description>Enter product weight in grams</Description>
          <Input
            type="number"
            value={data.weight === 0 ? "" : data.weight}
            onChange={(e) => setData("weight", Number(e.target.value))}
            placeholder="e.g., 350"
            min="1"
            required
          />
          {errors.weight && <FieldError>{errors.weight}</FieldError>}
        </div>

        <div className="space-y-2">
          <Label>Categories</Label>
          <Description>Select one or more product categories</Description>
          <Select
            selectionMode="multiple"
            value={selectedCategories}
            onChange={(selected) => {
              setSelectedCategories(selected);
              setData(
                "category_ids",
                Array.from(selected).map((id) => Number(id))
              );
            }}
            isRequired
          >
            <SelectTrigger>
              {selectedCategories.length > 0
                ? `${selectedCategories.length} categor${
                    selectedCategories.length === 1 ? "y" : "ies"
                  } selected`
                : "Select categories"}
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} id={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_ids && (
            <FieldError>{errors.category_ids}</FieldError>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Price</Label>
          <Description>Enter the product price in Rupiah</Description>
          <Input
            type="text"
            inputMode="numeric"
            value={data.price === 0 ? "" : data.price.toString()}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, "");
              setData("price", value === "" ? 0 : Number(value));
            }}
            placeholder="Enter price"
            required
          />
          {errors.price && <FieldError>{errors.price}</FieldError>}
        </div>

        <div className="space-y-2">
          <Label>Stock Quantity</Label>
          <Description>Enter the available stock</Description>
          <Input
            type="number"
            value={data.stock}
            onChange={(e) => setData("stock", Number(e.target.value))}
            placeholder="0"
            min="0"
            required
          />
          {errors.stock && <FieldError>{errors.stock}</FieldError>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Admin Notes</Label>
        <Description>Internal notes (not visible to customers)</Description>
        <Textarea
          value={data.notes}
          onChange={(e) => setData("notes", e.target.value)}
          placeholder="Enter admin notes..."
          rows={3}
        />
        {errors.notes && <FieldError>{errors.notes}</FieldError>}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Product Thumbnail</Label>
          <Description>
            Upload a main product image (optional, max 2MB)
          </Description>

          <div className="flex items-center gap-4">
            {(data.thumbnail || product?.thumbnail) && (
              <div className="relative">
                <img
                  src={
                    data.thumbnail
                      ? URL.createObjectURL(data.thumbnail)
                      : product?.thumbnail
                      ? `/storage/${product.thumbnail}`
                      : ""
                  }
                  alt="Thumbnail preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => setData("thumbnail", null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}

            <FileTrigger
              acceptedFileTypes={[
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
              ]}
              onSelect={(files) => {
                const fileArray = Array.from(files || []);
                const file = fileArray[0] || null;
                setData("thumbnail", file);
              }}
            ></FileTrigger>
          </div>

          {errors.thumbnail && <FieldError>{errors.thumbnail}</FieldError>}
          {data.thumbnail && data.thumbnail.size > 2048 * 1024 && (
            <FieldError>File size must be less than 2MB</FieldError>
          )}
        </div>

        <div className="space-y-2">
          <Label>Additional Images</Label>
          <Description>
            Upload additional product images (optional, max 2MB each)
          </Description>

          <div className="grid grid-cols-4 gap-4">
            {existingImages.map((imagePath, index) => (
              <div key={`existing-${index}`} className="relative">
                <img
                  src={`/storage/${imagePath}`}
                  alt={`Product view ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => {
                    const imageToRemove = existingImages[index];
                    const newImages = existingImages.filter(
                      (_, i) => i !== index
                    );
                    setExistingImages(newImages);
                    setData("removed_images", [
                      ...(data.removed_images || []),
                      imageToRemove,
                    ]);
                    setData("existing_images", newImages);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}

            {data.images?.map((file, index) => (
              <div key={`new-${index}`} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New view ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages =
                      data.images?.filter((_, i) => i !== index) || [];
                    setData("images", newImages.length > 0 ? newImages : null);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}

            <div className="flex-1 shrink-0 col-span-2 flex items-center">
              <FileTrigger
                allowsMultiple
                acceptedFileTypes={[
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/gif",
                ]}
                onSelect={(files) => {
                  const fileArray = Array.from(files || []);
                  const currentImages = data.images || [];
                  setData("images", [...currentImages, ...fileArray]);
                }}
              ></FileTrigger>
            </div>
          </div>

          {errors.images && <FieldError>{errors.images}</FieldError>}
          {data.images?.some((file: File) => file.size > 2048 * 1024) && (
            <FieldError>All files must be less than 2MB</FieldError>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        {onClose && (
          <Button
            type="button"
            intent="outline"
            onClick={onClose}
            isDisabled={processing}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" isDisabled={processing}>
          {processing ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
