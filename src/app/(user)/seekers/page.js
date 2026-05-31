import Link from "next/link"

export default async function Seekers()
{
    "use cache"
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    const post=await response.json()
    return <><div>seeker page</div>
    <ul>
        {post.map(post=>
        <Link key={post.id} href={`/seekers/${post.id}`}>
            <h3>Title:{post.title}</h3>
            <h4>Body:{post.body}</h4></Link>)}
    </ul>
    </>

}