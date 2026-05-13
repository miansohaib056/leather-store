import Link from "next/link";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pages | Admin" };

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CMS Pages</h1>
          <p className="text-sm text-muted-foreground">Manage static pages</p>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <FileText size={48} className="text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">No pages yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Static pages can be created via the database seed script
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">/{page.slug}</TableCell>
                  <TableCell>
                    <span className={page.isPublished ? "text-green-600" : "text-yellow-600"}>
                      {page.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(page.updatedAt)}
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
