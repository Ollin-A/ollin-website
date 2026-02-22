import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import PageLoader from "../components/PageLoader";

export default function Blog() {
  return (
    <div className="w-full min-h-screen pt-32 pb-20 px-[5vw]">
      <div className="max-w-[1500px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-semibold mb-8 text-ollin-black">
          Blogs
        </h1>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
