"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { addGuestbookEntry } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GuestbookEntry } from "@/data/guestbook";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GuestbookPage() {
  const { data: entries, error, isLoading, mutate } = useSWR<GuestbookEntry[]>("/api/guestbook", fetcher);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/guestbook/${id}`, { method: "DELETE" });
      mutate();
    } finally {
      setDeletingId(null);
    }
  };

  const handleAction = async (formData: FormData) => {
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      const result = await addGuestbookEntry(null, formData);
      if (result.success) {
        formRef.current?.reset();
        mutate();
      } else if (result.errors) {
        setFormErrors(result.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Sổ lưu bút</h1>
      
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Để lại lời nhắn</CardTitle>
          <CardDescription>Cảm ơn bạn đã ghé thăm trang web của mình!</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={handleAction} className="space-y-4">
            <div>
              <Input 
                name="name" 
                placeholder="Tên của bạn" 
                disabled={isSubmitting}
              />
              {formErrors?.name && <p className="text-sm text-destructive mt-1">{formErrors.name[0]}</p>}
            </div>
            <div>
              <Textarea 
                name="message" 
                placeholder="Lời nhắn..." 
                rows={4}
                disabled={isSubmitting}
              />
              {formErrors?.message && <p className="text-sm text-destructive mt-1">{formErrors.message[0]}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Đang gửi..." : "Gửi lời nhắn"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Lời nhắn gần đây</h2>
        
        {isLoading && <p className="text-muted-foreground text-center py-4">Đang tải...</p>}
        {error && <p className="text-destructive text-center py-4">Lỗi khi tải dữ liệu.</p>}
        
        {entries?.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="pt-6 flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold text-lg">{entry.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(entry.createdAt).toLocaleString("vi-VN")}
                </p>
                <p className="whitespace-pre-wrap">{entry.message}</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDelete(entry.id)}
                disabled={deletingId === entry.id}
              >
                {deletingId === entry.id ? "Đang xóa..." : "Xóa"}
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {entries?.length === 0 && (
          <p className="text-center text-muted-foreground py-8 border rounded-lg bg-muted/50">
            Chưa có lời nhắn nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>
    </div>
  );
}
