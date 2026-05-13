"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();

  const [storeName, setStoreName] = useState("RIQUE");
  const [storeEmail, setStoreEmail] = useState("hello@riqueleather.com");
  const [storePhone, setStorePhone] = useState("+1 (555) 000-0000");
  const [storeAddress, setStoreAddress] = useState("");
  const [shippingThreshold, setShippingThreshold] = useState("150");
  const [shippingRate, setShippingRate] = useState("15");
  const [metaTitle, setMetaTitle] = useState("RIQUE - Premium Leather Goods");
  const [metaDescription, setMetaDescription] = useState(
    "Premium handcrafted leather goods. Wallets, belts, bags, and accessories."
  );

  const handleSave = () => {
    startTransition(async () => {
      toast.success("Settings saved");
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Store Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your store</p>
        </div>
        <Button onClick={handleSave} disabled={isPending} className="rounded-none">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Store Name</Label>
              <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className="mt-1" rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Free Shipping Threshold ($)</Label>
              <Input type="number" value={shippingThreshold} onChange={(e) => setShippingThreshold(e.target.value)} className="mt-1" />
              <p className="mt-1 text-xs text-muted-foreground">
                Orders above this amount get free shipping
              </p>
            </div>
            <div>
              <Label>Standard Shipping Rate ($)</Label>
              <Input type="number" value={shippingRate} onChange={(e) => setShippingRate(e.target.value)} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>SEO Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Meta Title</Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Default Meta Description</Label>
              <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="mt-1" rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
