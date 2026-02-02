import React from 'react';

const Blog: React.FC = () => {
    return (
        <div className="w-full min-h-screen pt-32 pb-20 px-[5vw]">
            <div className="max-w-[1500px] mx-auto">
                <h1 className="text-4xl md:text-6xl font-semibold mb-8 text-ollin-black">Blog</h1>
                <p className="text-lg text-ollin-black opacity-70">
                    Insights and updates from OLLIN. Content coming soon.
                </p>
            </div>
        </div>
    );
};

export default Blog;
