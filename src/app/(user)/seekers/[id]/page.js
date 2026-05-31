import { Suspense } from "react";

export default function Wrapper({ params }) {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Post params={params} />
        </Suspense>
    );
}

async function Post({ params }) {
    const { id } = await params;

    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        { cache: "force-cache" }
    );

    const post = await res.json();

    return (
        <div>
            <h3>title: {post.title}</h3>
            <h4>Body: {post.body}</h4>
        </div>
    );
}