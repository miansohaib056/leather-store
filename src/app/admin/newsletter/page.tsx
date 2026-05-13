import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Newsletter | Admin" };

export default async function NewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const activeCount = subscribers.filter((s) => s.isActive).length;

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        <p className="text-sm text-muted-foreground">
          {activeCount} active / {subscribers.length} total subscribers
        </p>
      </div>

      {subscribers.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Mail size={48} className="text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">No subscribers yet</p>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Subscribed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell>
                    <span className={sub.isActive ? "text-green-600" : "text-red-600"}>
                      {sub.isActive ? "Active" : "Unsubscribed"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sub.source || "Website"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(sub.subscribedAt)}
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
