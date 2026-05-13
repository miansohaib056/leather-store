"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateOrderStatus, updateTrackingInfo } from "@/actions/orders";
import { toast } from "sonner";
import type { OrderStatus } from "@prisma/client";

const statusFlow: OrderStatus[] = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED",
];

interface OrderStatusManagerProps {
  orderId: string;
  currentStatus: OrderStatus;
  trackingNumber?: string | null;
  courierName?: string | null;
}

export function OrderStatusManager({
  orderId,
  currentStatus,
  trackingNumber: initialTracking,
  courierName: initialCourier,
}: OrderStatusManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [tracking, setTracking] = useState(initialTracking || "");
  const [courier, setCourier] = useState(initialCourier || "");

  const currentIndex = statusFlow.indexOf(currentStatus);
  const nextStatus = currentIndex >= 0 && currentIndex < statusFlow.length - 1
    ? statusFlow[currentIndex + 1]
    : null;

  const handleStatusUpdate = async (status: OrderStatus) => {
    setLoading(true);
    try {
      if (status === "SHIPPED" && tracking) {
        await updateTrackingInfo(orderId, tracking, courier);
      }
      await updateOrderStatus(orderId, status, note || undefined);
      toast.success(`Order marked as ${status}`);
      setNote("");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {currentStatus === "PROCESSING" && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Tracking Number</Label>
              <Input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. 1Z999AA..." />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Courier</Label>
              <Input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="e.g. FedEx" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs">Note (optional)</Label>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Internal note..." />
        </div>

        <div className="flex flex-col gap-2">
          {nextStatus && (
            <Button onClick={() => handleStatusUpdate(nextStatus)} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Mark as {nextStatus}
            </Button>
          )}
          {currentStatus !== "CANCELLED" && currentStatus !== "DELIVERED" && (
            <Button
              variant="destructive"
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={loading}
              className="w-full"
            >
              Cancel Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
