import Link from "next/link";
import { Post } from "@/types/post";

export default async function BlogPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  
  const allPosts: Post[] = await res.json();
  const posts = allPosts.slice(0, 10);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Danh sách bài viết</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id} className="block group">
            <div className="p-6 h-full border rounded-xl hover:shadow-lg transition-all bg-card text-card-foreground group-hover:border-primary">
              <h2 className="text-xl font-semibold mb-3 capitalize line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground line-clamp-3">
                {post.body}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
