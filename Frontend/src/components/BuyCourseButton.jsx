import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetCourseByIdQuery } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import PaymentForm from "./PaymentForm";

const BuyCourseButton = ({ courseId }) => {
  const [open, setOpen] = useState(false);
  const { data: courseData, isLoading } = useGetCourseByIdQuery(courseId);

  const handlePaymentSuccess = () => {
    setOpen(false);
    // You might want to refresh the course data or redirect
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Buy Course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Enter your payment details to purchase this course.
          </DialogDescription>
        </DialogHeader>
        <PaymentForm 
          amount={courseData?.course?.coursePrice || 0} 
          onSuccess={handlePaymentSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BuyCourseButton;