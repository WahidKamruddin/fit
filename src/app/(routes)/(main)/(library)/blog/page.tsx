import Blog from "@/src/app/components/blog";
import blogData from "@/src/app/data/blogs.json"; // Adjust the path if needed


const Blogs = () => {
    const blogs = blogData

    return (
        <div className="pt-24 px-36 w-full h-screen flex flex-col items-start gap-14">
            {blogs.map((someBlog) => (
                <div key={someBlog.id} className="w-full">
                    <Blog title={someBlog.title} date={someBlog.date} content={someBlog.content} />
                </div>
            ))}
        </div>
    );
}
 
export default Blogs;