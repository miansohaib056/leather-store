"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { createProduct, updateProduct } from "@/actions/products";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  children?: CategoryOption[];
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: ProductInput & { id?: string };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      basePrice: 0,
      compareAtPrice: null,
      costPrice: null,
      sku: "",
      material: "",
      isFeatured: false,
      isActive: true,
      categoryIds: [],
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const watchName = watch("name");

  const onSubmit = async (data: ProductInput) => {
    try {
      if (isEditing && initialData?.id) {
        await updateProduct(initialData.id, data);
        toast.success("Product updated");
      } else {
        await createProduct(data);
        toast.success("Product created");
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g. Classic Bifold Wallet"
                  onChange={(e) => {
                    register("name").onChange(e);
                    if (!isEditing) {
                      setValue("slug", slugify(e.target.value));
                    }
                  }}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input id="slug" {...register("slug")} placeholder="classic-bifold-wallet" />
                {errors.slug && (
                  <p className="text-xs text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  {...register("shortDescription")}
                  placeholder="Brief product summary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Detailed product description..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Price ($) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    {...register("basePrice", { valueAsNumber: true })}
                  />
                  {errors.basePrice && (
                    <p className="text-xs text-destructive">{errors.basePrice.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    {...register("compareAtPrice", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price ($)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    {...register("costPrice", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Variants</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    name: "",
                    sku: null,
                    color: null,
                    size: null,
                    price: null,
                    stock: 0,
                    lowStockThreshold: 5,
                    isActive: true,
                    sortOrder: fields.length,
                  })
                }
              >
                <Plus size={14} className="mr-1" />
                Add Variant
              </Button>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No variants. Add variants for different colors, sizes, etc.
                </p>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium">Variant {index + 1}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Name *</Label>
                          <Input
                            {...register(`variants.${index}.name`)}
                            placeholder="e.g. Black / Large"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Color</Label>
                          <Input
                            {...register(`variants.${index}.color`)}
                            placeholder="Black"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Size</Label>
                          <Input
                            {...register(`variants.${index}.size`)}
                            placeholder="Large"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">SKU</Label>
                          <Input
                            {...register(`variants.${index}.sku`)}
                            placeholder="BFW-BLK-L"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Price Override ($)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`variants.${index}.price`, { valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Stock *</Label>
                          <Input
                            type="number"
                            {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Low Stock Alert</Label>
                          <Input
                            type="number"
                            {...register(`variants.${index}.lowStockThreshold`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" {...register("metaTitle")} placeholder="SEO title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register("metaDescription")}
                  placeholder="SEO description (max 160 characters)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", !!checked)}
                />
                <Label htmlFor="isActive">Active (visible in store)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isFeatured"
                  checked={watch("isFeatured")}
                  onCheckedChange={(checked) => setValue("isFeatured", !!checked)}
                />
                <Label htmlFor="isFeatured">Featured product</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" {...register("sku")} placeholder="Product SKU" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  {...register("material")}
                  placeholder="e.g. Full Grain Leather"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  {...register("weight", { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No categories yet. Create categories first.
                </p>
              ) : (
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={watch("categoryIds")?.includes(cat.id)}
                        onCheckedChange={(checked) => {
                          const current = watch("categoryIds") || [];
                          if (checked) {
                            setValue("categoryIds", [...current, cat.id]);
                          } else {
                            setValue(
                              "categoryIds",
                              current.filter((id) => id !== cat.id)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`cat-${cat.id}`} className="text-sm">
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Care Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register("careInstructions")}
                placeholder="How to care for this product..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
