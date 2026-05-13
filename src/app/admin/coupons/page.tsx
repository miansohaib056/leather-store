"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCoupons, createCoupon, deleteCoupon } from "@/actions/coupons";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: string;
  minimumPurchase: string | null;
  maximumDiscount: string | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minimumPurchase, setMinimumPurchase] = useState("");
  const [maximumDiscount, setMaximumDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    getCoupons().then(setCoupons);
  }, []);

  const handleCreate = () => {
    startTransition(async () => {
      try {
        await createCoupon({
          code: code.toUpperCase(),
          description: description || undefined,
          discountType: discountType as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING",
          discountValue: Number(discountValue),
          minimumPurchase: minimumPurchase ? Number(minimumPurchase) : undefined,
          maximumDiscount: maximumDiscount ? Number(maximumDiscount) : undefined,
          usageLimit: usageLimit ? Number(usageLimit) : undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        });
        const updated = await getCoupons();
        setCoupons(updated);
        setOpen(false);
        resetForm();
        toast.success("Coupon created");
      } catch {
        toast.error("Failed to create coupon");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteCoupon(id);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        toast.success("Coupon deleted");
      } catch {
        toast.error("Failed to delete coupon");
      }
    });
  };

  const resetForm = () => {
    setCode("");
    setDescription("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMinimumPurchase("");
    setMaximumDiscount("");
    setUsageLimit("");
    setExpiresAt("");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage discount codes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="rounded-none">
              <Plus className="mr-1 h-4 w-4" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Coupon</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <Label>Code</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="SUMMER25"
                  className="mt-1 uppercase"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summer sale discount"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={discountType} onValueChange={(v) => v && setDiscountType(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                      <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Value</Label>
                  <Input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "PERCENTAGE" ? "25" : "10.00"}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Min. Purchase</Label>
                  <Input
                    type="number"
                    value={minimumPurchase}
                    onChange={(e) => setMinimumPurchase(e.target.value)}
                    placeholder="50.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Max. Discount</Label>
                  <Input
                    type="number"
                    value={maximumDiscount}
                    onChange={(e) => setMaximumDiscount(e.target.value)}
                    placeholder="100.00"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Usage Limit</Label>
                  <Input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="100"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Expires At</Label>
                  <Input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full rounded-none" disabled={isPending}>
                Create Coupon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Tag size={48} className="text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">No coupons created</p>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.discountType === "PERCENTAGE"
                      ? `${Number(coupon.discountValue)}%`
                      : coupon.discountType === "FIXED_AMOUNT"
                        ? `$${Number(coupon.discountValue).toFixed(2)}`
                        : "Free Shipping"}
                  </TableCell>
                  <TableCell>
                    {coupon.usageCount}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {coupon.expiresAt ? formatDate(coupon.expiresAt) : "No expiry"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={coupon.isActive ? "text-green-600" : "text-red-600"}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(coupon.id)}
                      disabled={isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
