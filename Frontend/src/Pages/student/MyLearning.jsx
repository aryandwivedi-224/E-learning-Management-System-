import React from 'react';
import Course from './Course';

const MyLearning = () => {
    const isLoading = false;
    const MyLearningCourses = [ ];
    return (
        <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
            <h1 className="font-bold text-2xl">MY LEARNING</h1>
            <div className="my-5">
                {isLoading ? (
                    <MyLearningSkeleton />
                ) : MyLearningCourses.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">You are not enrolled in any courses</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {MyLearningCourses.map((course, index) => (
                            <Course key={index} course={course}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning;

const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
            ></div>
        ))}
    </div>
);