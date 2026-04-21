import { Post, User, Comment } from "@/types/post";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

async function getUser(userId: number): Promise<User> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

async function getComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  // Wait for `params` in Next.js 15+ if needed, but in app router standard it's ok as synchronous if not using await, wait, Next 15 requires `await params`
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.id);
  
  // Chạy song song tác giả và bình luận giúp giảm thời gian chờ
  const [author, comments] = await Promise.all([
    getUser(post.userId),
    getComments(resolvedParams.id)
  ]);

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Link href="/blog">
        <Button variant="outline" className="mb-6">&larr; Quay lại Blog</Button>
      </Link>
      
      <article className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 capitalize">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4 mb-8 text-muted-foreground">
          <Badge variant="secondary">Tác giả: {author.name}</Badge>
          <span>Email: {author.email}</span>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl leading-relaxed">{post.body}</p>
        </div>
      </article>

      <div className="mt-12 pt-8 border-t">
        <h3 className="text-2xl font-semibold tracking-tight mb-6">
          Bình luận ({comments.length})
        </h3>
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{comment.name}</CardTitle>
                <CardDescription>{comment.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{comment.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
