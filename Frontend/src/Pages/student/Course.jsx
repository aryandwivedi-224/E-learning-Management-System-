import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Course = ({course}) => {
    return (
        <Link to={`/course-detail/${course._id}`}>
        <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="relative">
                <img
                    src={course.courseThumbnail}
                    className="w-full h-36 object-cover"
                    alt="Course thumbnail"
                />
            </div>
            <CardContent className="p-4">
                <h1 className="text-lg font-bold truncate text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <span className="relative">
                        {course.courseTitle}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                </h1>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-md">
                            <AvatarImage src={course.creator?.photoUrl||"https://github.com/shadcn.png"} alt="@shadcn" className="rounded-full" />
                            <AvatarFallback className="rounded-full bg-blue-500 text-white">CN</AvatarFallback>
                        </Avatar>
                        <h1 className="text-xs font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer">Aryan mernstack</h1>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 text-xs font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-600 hover:to-blue-700">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            {course.courseLevel}
                        </span>
                    </Badge>
                </div>
                <div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 line-through mr-2"> ₹9999</span>
                        ₹{course.coursePrice}
                    </span>
                </div>
            </CardContent>
        </Card>
        </Link>
    )
}

export default Course;
