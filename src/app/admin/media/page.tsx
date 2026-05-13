import { ImageIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Media | Admin" };

export default function MediaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Media Library</h1>
      <p className="text-sm text-muted-foreground">Manage product images and assets</p>
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <ImageIcon size={48} className="text-muted-foreground/30" />
        <p className="mt-4 text-muted-foreground">
          Upload images through the product editor
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          A dedicated media library with drag-and-drop is coming soon
        </p>
      </div>
    </div>
  );
}
