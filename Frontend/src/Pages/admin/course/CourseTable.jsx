
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom';
import { useGetCreatorCourseQuery } from '@/features/api/courseApi';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CourseTable = () => {
    const { data, isLoading, isError, error, refetch } = useGetCreatorCourseQuery();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                <Skeleton className="h-10 w-48 mb-4" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
                <p className="text-muted-foreground mb-4">
                    {error?.data?.message || "Failed to load courses"}
                </p>
                <Button variant="outline" onClick={refetch}>
                    Retry
                </Button>
            </div>
        );
    }

    if (!data?.courses || data.courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-medium">No courses found</h3>
                    <p className="text-sm text-muted-foreground">
                        Get started by creating a new course.
                    </p>
                    <Button onClick={() => navigate('create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Course
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Courses</h2>
                <Button onClick={() => navigate('create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.courses.map((course) => (
                            <TableRow key={course._id}>
                                <TableCell className="font-medium">
                                    {course?.coursePrice ? `$${course.coursePrice}` : "Free"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={course.isPublished ? "default" : "secondary"}>
                                        {course.isPublished ? "Published" : "Draft"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{course.courseTitle}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`${course._id}`)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default CourseTable;