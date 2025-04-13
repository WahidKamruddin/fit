const Blog = (props: { title: string; date: string; content: string}) => {

    const { title, date, content } = props;

    return (
        <div className="">
            <div className="flex justify-between">
            <h1 className="text-3xl">{title}</h1>
            <p className="text-sm text-gray-500">{date}</p>
            </div>

            <p className="mt-6 text-gray-500">{content}</p>
        </div>
    );
}
 
export default Blog;