import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl mb-6">
        Lab 3 - Data Fetching & API Routes
      </h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
        Đây là phần thực hành Lab 3. Bao gồm: Lấy dữ liệu Server-side, API Routes, Lấy dữ liệu Client-side với SWR, Server Actions và xác thực Zod.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/blog">
          <Button size="lg" className="w-full sm:w-auto text-lg px-8">
            Đến trang Blog (Phần 1)
          </Button>
        </Link>
        <Link href="/guestbook">
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
            Đến trang Sổ lưu bút (Phần 2, 3, 4, 5)
          </Button>
        </Link>
      </div>
    </div>
  );
}
