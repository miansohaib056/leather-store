"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, MapPin, Loader2 } from "lucide-react";
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
import { shippingSchema, type ShippingInput } from "@/lib/validations/checkout";
import {
  getAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/actions/addresses";
import { toast } from "sonner";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingInput>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { country: "PK" },
  });

  useEffect(() => {
    getAddresses().then(setAddresses);
  }, []);

  const onSubmit = (data: ShippingInput) => {
    startTransition(async () => {
      try {
        await createAddress(data);
        const updated = await getAddresses();
        setAddresses(updated);
        reset();
        setOpen(false);
        toast.success("Address added");
      } catch {
        toast.error("Failed to add address");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteAddress(id);
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Address removed");
      } catch {
        toast.error("Failed to delete address");
      }
    });
  };

  const handleSetDefault = (id: string) => {
    startTransition(async () => {
      try {
        await setDefaultAddress(id);
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: a.id === id }))
        );
        toast.success("Default address updated");
      } catch {
        toast.error("Failed to update default address");
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button size="sm" className="rounded-none">
              <Plus className="mr-1 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...register("fullName")} className="mt-1" />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} className="mt-1" />
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="addressLine1">Address</Label>
                <Input id="addressLine1" {...register("addressLine1")} className="mt-1" />
                {errors.addressLine1 && (
                  <p className="mt-1 text-xs text-destructive">{errors.addressLine1.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city")} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...register("state")} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" {...register("postalCode")} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...register("country")} className="mt-1" />
                </div>
              </div>
              <Button type="submit" className="w-full rounded-none" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Address
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <MapPin size={48} className="text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">No saved addresses</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="relative rounded-lg border p-4">
              {address.isDefault && (
                <span className="absolute right-3 top-3 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Default
                </span>
              )}
              <p className="font-medium">{address.fullName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {address.addressLine1}
                {address.addressLine2 && `, ${address.addressLine2}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-sm text-muted-foreground">{address.phone}</p>
              <div className="mt-3 flex gap-2">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    disabled={isPending}
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  disabled={isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
