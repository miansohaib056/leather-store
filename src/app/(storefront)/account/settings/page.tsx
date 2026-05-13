"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateProfile, changePassword } from "@/actions/account";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(session?.user?.name || "");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateProfile = () => {
    startTransition(async () => {
      try {
        const result = await updateProfile({ name, phone: phone || undefined });
        if (result.error) {
          toast.error(result.error);
        } else {
          await update({ name });
          toast.success("Profile updated");
        }
      } catch {
        toast.error("Failed to update profile");
      }
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    startTransition(async () => {
      try {
        const result = await changePassword({ currentPassword, newPassword });
        if (result.error) {
          toast.error(result.error);
        } else {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          toast.success("Password changed");
        }
      } catch {
        toast.error("Failed to change password");
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Profile Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your account details
        </p>
        <div className="mt-4 max-w-md space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={session?.user?.email || ""}
              disabled
              className="mt-1 bg-muted"
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleUpdateProfile}
            disabled={isPending}
            className="rounded-none"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your password to keep your account secure
        </p>
        <div className="mt-4 max-w-md space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={isPending}
            variant="outline"
            className="rounded-none"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
