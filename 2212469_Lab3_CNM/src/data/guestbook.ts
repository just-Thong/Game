export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export let guestbookEntries: GuestbookEntry[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    message: "Trang web rất tuyệt! Mình rất thích thiết kế này.",
    createdAt: new Date().toISOString()
  }
];
