import React, { useState, useEffect } from "react";
import { School, Menu, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, BookOpen, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkMode from '../Pages/DarkMode';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authapi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Navbar = () => {
    // const user = true;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");

    const logoutHandler = async () => {
        await logoutUser();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = searchInput.trim();
        if (searchTerm) {
            navigate(`/course/search?query=${encodeURIComponent(searchTerm)}`);
        } else {
            navigate('/course/search?showAll=true');
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Logged out successfully");
            navigate("/login");
        }
        // Check if user has a theme preference in localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, [isSuccess]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            {/* desktop */}
            <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
                <Link to="/" className="flex items-center gap-2">
                    <School size={30} />
                    <h1 className="font-extrabold text-2xl">A - Learning</h1>
                </Link>

                {/* Search Form */}
                {/* <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search courses..."
                            className="flex-1"
                        />
                        <Button type="submit" className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </form> */}

                {/* User icon and dark mode */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage 
                                        src={user.photoUrl || "https://github.com/shadcn.png"} 
                                        alt={user.name}
                                    />
                                    <AvatarFallback>{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Link to="/my-learning" className="flex items-center w-full">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            <span>My learning</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="/profile" className="flex items-center w-full">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Edit Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {user.role==="instructor" &&(
                                         <>   
                                        <Link to="/admin/dashboard" className="flex items-center w-full">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                        </>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logoutHandler}>
                                    <div className="flex items-center w-full text-red-600 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to="/login?tab=account">
                                <Button>Signup</Button>
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-yellow-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <div className="flex md:hidden items-center justify-between px-4 h-full">
                <Link to="/" className="font-extrabold text-2xl">A-learning</Link>
                <MobileNavbar logoutHandler={logoutHandler} />
            </div>
        </div>
    );
};

export default Navbar;

const MobileNavbar = ({ logoutHandler }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' className="rounded-full bg-gray-200 hover:bg-gray-300" variant="outline">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row justify-between mt-2">
                    <SheetTitle>A-Learning</SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <Separator className="my-4" />
                <nav className="flex flex-col gap-4">
                    <Link to="/my-learning" className="flex items-center gap-2 hover:text-blue-600">
                        <BookOpen className="h-4 w-4" />
                        <span>My Courses</span>
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 hover:text-blue-600">
                        <User className="h-4 w-4" />
                        <span>Edit Profile</span>
                    </Link>
                    <div onClick={logoutHandler} className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
};
     
