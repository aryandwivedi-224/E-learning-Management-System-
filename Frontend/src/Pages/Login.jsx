import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRegisterUserMutation, useLoginUserMutation } from "@/features/api/authapi";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "account" ? "account" : "password";
  
  // State for form inputs
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    instructorCode: ""
  });

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: ""
  });

  // Mutation hooks
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const navigate = useNavigate();
  
  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Handlers
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput(prev => ({ ...prev, [name]: value }));
    } else {
      setLoginInput(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegistration = async (type) => {
    try {
      const inputdata = type === "signup" ? signupInput : loginInput;
      
      // Validate required fields for signup
      if (type === "signup") {
        if (!inputdata.name || !inputdata.email || !inputdata.password) {
          toast.error("All fields are required");
          return;
        }

        if (!validateEmail(inputdata.email)) {
          toast.error("Please enter a valid email address");
          return;
        }

        if (!validatePassword(inputdata.password)) {
          toast.error("Password must be at least 6 characters long");
          return;
        }

        if (inputdata.role === "instructor" && !inputdata.instructorCode) {
          toast.error("Instructor code is required");
          return;
        }

        const response = await registerUser(inputdata).unwrap();
        if (response.success) {
          toast.success(response.message || "Registration successful");
          // Clear form after successful registration
          setSignupInput({
            name: "",
            email: "",
            password: "",
            role: "student",
            instructorCode: ""
          });
          // Switch to login tab after successful registration
          navigate("/login");
        }
      } else {
        await handleLogin(inputdata);
      }
    } catch (error) {
      console.error('Registration/Login failed:', error);
      const errorMessage = error?.data?.message || "Operation failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      if (!credentials.email || !credentials.password) {
        toast.error("Please enter both email and password");
        return;
      }

      if (!validateEmail(credentials.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      const response = await loginUser(credentials).unwrap();
      if (response.success) {
        toast.success(response.message || "Login successful");
        navigate("/");
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error?.data?.message || "Login failed. Please check your credentials and try again.";
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(loginInput);
  };

  useEffect(() => {
    if(registerIsSuccess && registerData){
      toast.success(registerData.message || "Signup successful");
      // Clear form after successful registration
      setSignupInput({
        name: "",
        email: "",
        password: "",
        role: "student",
        instructorCode: ""
      });
    }
    if(registerError){
      const errorMessage = registerError?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    }
    if(loginIsSuccess && loginData){
      const welcomeMessage = loginData.message || `Welcome back, ${loginData.user?.name || 'User'}!`;
      toast.success(welcomeMessage);
      navigate("/");
    }
    if(loginError){ 
      const errorMessage = loginError?.data?.message || "Login failed. Please check your credentials and try again.";
      toast.error(errorMessage);
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);

  return (
    <div className="flex items-center w-full justify-center mt-16">
      <Tabs defaultValue={defaultTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Signup</TabsTrigger>
          <TabsTrigger value="password">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Fill all requirements and signup to create an account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleRegistration("signup");
            }}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>I want to join as</Label>
                <RadioGroup
                  defaultValue="student"
                  onValueChange={(value) => setSignupInput({ ...signupInput, role: value })}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="font-normal">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="instructor" id="instructor" />
                    <Label htmlFor="instructor" className="font-normal">
                      Instructor
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Enter your name"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Enter your email"
                    required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Enter your password"
                    required
                />
              </div>
              {signupInput.role === "instructor" && (
                <div className="space-y-1">
                  <Label htmlFor="instructorCode">Instructor Code</Label>
                  <Input
                    type="password"
                    name="instructorCode"
                    value={signupInput.instructorCode}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Enter instructor code"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Please enter the instructor code to verify your identity
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={registerIsLoading}>
                  {
                    registerIsLoading ? (
                      <>
                        <Loader2 className="mr-4 w-4 h-4 animate-spin" />please wait few seconds
                      </>
                    ) :
                      "Signup"
                  }
                </Button>
            </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login to your existing account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Enter your email"
                    required
                />
              </div>
              <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Enter your password"
                    required
                />
              </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={loginIsLoading} className="w-full">
                  {
                    loginIsLoading ? (
                      <>
                        <Loader2 className="mr-4 w-4 h-4 animate-spin" />please wait few seconds
                      </>
                    ) :
                      "Login"
                  }
                </Button>
            </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;

