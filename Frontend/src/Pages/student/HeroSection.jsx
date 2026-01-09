import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreCourses = () => {
    navigate("/course/search?showAll=true");
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-12 text-center w-full overflow-hidden">
      {/* Semi-transparent overlay for glass effect */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm z-0"></div>
      
      {/* Light mode pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent dark:hidden"></div>
      
      {/* Dark mode pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-transparent to-transparent hidden dark:block"></div>

      {/* Edge fillers to prevent transparency */}
      <div className="absolute -left-4top-0 bottom-0 w-4 bg-blue-600 dark:bg-gray-900"></div>
      <div className="absolute -right-4 top-0 bottom-0 w-4 bg-indigo-600 dark:bg-indigo-900"></div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-white dark:text-gray-100 text-4xl font-bold mb-4 drop-shadow-lg">
            Welcome to our website
          </h1>
          <p className="text-gray-100 dark:text-gray-300 mb-8 text-lg">
            Discover the best courses for your learning
          </p>

          <form action="" className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              className="text-gray-700 dark:text-gray-100 bg-white/90 dark:bg-gray-800/90 border-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-indigo-500 px-2 py-1 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out w-full text-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none backdrop-blur-sm"
              name="search"
              placeholder="Search Courses"
            />
            <button
              type="submit"
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-indigo-400 px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center gap-2 whitespace-nowrap w-full sm:w-auto font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </form>
          
          <button
            onClick={handleExploreCourses}
            className="mt-6 bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-800/70 text-white dark:text-gray-100 px-6 py-1 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center gap-2 mx-auto font-medium backdrop-blur-sm border border-white/20 dark:border-gray-700/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
