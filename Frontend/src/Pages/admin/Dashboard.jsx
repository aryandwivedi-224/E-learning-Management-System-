import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React, { useMemo } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { data: purchaseData, isSuccess: purchaseSuccess, isError: purchaseError, isLoading: purchaseLoading } = useGetPurchasedCoursesQuery();
  const { data: creatorCourses, isSuccess: courseSuccess, isError: courseError, isLoading: courseLoading } = useGetCreatorCourseQuery();

  // Move all useMemo hooks before any conditional returns
  const chartData = useMemo(() => {
    const purchasedCourses = purchaseData?.purchasedCourse || [];
    
    if (purchasedCourses.length === 0) {
      // Sample data for demonstration
      return [
        { name: "Web Development", price: 255, students: 45, revenue: 1963 },
        { name: "Data Science", price: 423, students: 32, revenue: 555 },
        { name: "Machine Learning", price: 123, students: 28, revenue: 1132 },
        { name: "Python Basics", price: 123, students: 65, revenue: 12351 },
        { name: "React Mastery", price: 156, students: 38, revenue: 13296 },
        { name: "Node.js", price: 96, students: 42, revenue: 12595 }
      ];
    }

    return purchasedCourses.map((course) => ({
      name: course.courseId.courseTitle,
      price: course.courseId.coursePrice,
      students: course.students?.length || 0,
      revenue: (course.courseId.coursePrice || 0) * (course.students?.length || 0)
    }));
  }, [purchaseData]);

  const categoryData = useMemo(() => {
    const courses = creatorCourses?.courses || [];
    
    if (courses.length === 0) {
      return {
        "Web Development": 3,
        "Data Science": 2,
        "Machine Learning": 1,
        "Python": 2,
        "React": 2,
        "Node.js": 1
      };
    }

    return courses.reduce((acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1;
      return acc;
    }, {});
  }, [creatorCourses]);

  const pieData = useMemo(() => 
    Object.entries(categoryData).map(([name, value]) => ({
      name,
      value
    })), [categoryData]);

  // Calculate statistics
  const totalRevenue = useMemo(() => 
    chartData.reduce((sum, course) => sum + (course.revenue || 0), 0), 
    [chartData]
  );
  
  const totalStudents = useMemo(() => 
    chartData.reduce((sum, course) => sum + course.students, 0),
    [chartData]
  );
  
  const totalCourses = useMemo(() => 
    chartData.length,
    [chartData]
  );
  
  const averagePrice = useMemo(() => 
    totalRevenue / totalStudents || 0,
    [totalRevenue, totalStudents]
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? '₹' : ''}{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading and error states after all hooks
  if (purchaseLoading || courseLoading) return <h1>Loading...</h1>;
  if (purchaseError || courseError) return <h1 className="text-red-500">Failed to load dashboard data</h1>;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">+2 new courses this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{averagePrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+4.75% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Students per Course Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Students per Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="students" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course Categories Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Course Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course Performance Trend */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Course Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
