"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import { createCategory, getCategories } from "@/actions/categories";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

export default function NewCategoryPage() {
  const router = useRouter();
  const [parents, setParents] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getCategories().then((cats) =>
      setParents(cats.map((c) => ({ id: c.id, name: c.name })))
    );
  }, []);

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", isActive: true, sortOrder: 0 },
  });

  const onSubmit = async (data: CategoryInput) => {
    try {
      await createCategory(data);
      toast.success("Category created");
      router.push("/admin/categories");
    } catch {
      toast.error("Failed to create category");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Category</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                {...register("name")}
                placeholder="e.g. Wallets"
                onChange={(e) => {
                  register("name").onChange(e);
                  setValue("slug", slugify(e.target.value));
                }}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input {...register("slug")} placeholder="wallets" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Parent Category</Label>
              <select
                {...register("parentId")}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="">None (Top Level)</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" {...register("sortOrder", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input {...register("image")} placeholder="https://..." />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={watch("isActive")}
                onCheckedChange={(c) => setValue("isActive", !!c)}
              />
              <Label>Active</Label>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input {...register("metaTitle")} />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea {...register("metaDescription")} rows={2} />
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}
