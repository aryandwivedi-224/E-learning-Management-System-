import React, { useState, useEffect } from "react";
import Filter from "@/Pages/Filter";
import SearchResult from "@/Pages/SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query") || "";
  const showAll = searchParams.get("showAll") === "true";
  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategories, setSelectedCatgories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const { data, isLoading, error } = useGetSearchCourseQuery({
    searchQuery: showAll ? "" : query,
    categories: selectedCategories,
    sortByPrice
  });

  // Update search input when query changes
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = searchInput.trim();
    if (searchTerm) {
      navigate(`/course/search?query=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/course/search?showAll=true');
    }
  };

  console.log('Search Results:', {
    query,
    showAll,
    selectedCategories,
    data,
    isLoading,
    error,
    courses: data?.courses
  });

  const isEmpty = !isLoading && (!data?.courses || data.courses.length === 0);

  const handleFilterChange = (categories, price) => {
    setSelectedCatgories(categories);
    setSortByPrice(price);
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col items-center justify-center min-h-32">
          <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
          <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
            Error Loading Results
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Sorry, there was an error loading the search results.
          </p>
          <Link to="/" className="italic">
            <Button variant="link">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="my-6">
        <form onSubmit={handleSearch} className="max-w-2xl mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search courses by title..."
              className="flex-1"
            />
            <Button type="submit" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </form>

        <h1 className="font-bold text-xl md:text-2xl">
          {selectedCategories.length > 0 
            ? `Courses in ${selectedCategories.join(", ")}`
            : showAll 
              ? "All Courses" 
              : `Results for "${query}"`
          }
        </h1>
        {!showAll && !selectedCategories.length && (
          <p>
            Showing results for{" "}
            <span className="text-blue-800 font-bold italic">{query}</span>
          </p>
        )}
        {selectedCategories.length > 0 && (
          <p className="text-gray-600 dark:text-gray-400">
            Showing {data?.courses?.length || 0} courses in selected categories
          </p>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <Filter handleFilterChange={handleFilterChange}/>
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <EmptyResults 
              query={query} 
              selectedCategories={selectedCategories}
              onClearFilters={() => {
                setSelectedCatgories([]);
                setSortByPrice("");
                if (query) {
                  navigate('/course/search?showAll=true');
                }
              }}
            />
          ) : (
            data?.courses?.map((course) => <SearchResult key={course._id} course={course}/>)
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyResults = ({ query, selectedCategories, onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        No Courses Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 text-center">
        {query 
          ? `No courses found matching "${query}"`
          : selectedCategories.length > 0
            ? `No courses found in selected categories`
            : "No courses available at the moment"
        }
      </p>
      <Button 
        onClick={onClearFilters}
        variant="outline"
        className="flex items-center gap-2"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default SearchPage;

const CourseSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
      <div className="h-32 w-full md:w-64">
        <Skeleton className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20 mt-2" />
      </div>

      <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
};
