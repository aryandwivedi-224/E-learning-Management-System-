import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    if (!courseId || !lecture?._id) {
      toast.error("Invalid course or lecture");
      return;
    }
    navigate(`/admin/course/${courseId}/lecture/${lecture._id}`, {
      state: { lecture }
    });
  };

  return (
    <div className="flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2">
      <h1 className="font-bold text-gray-800 dark:text-gray-100">
        Lecture - {index + 1}: {lecture.lectureTitle}
      </h1>
      <Edit
        onClick={goToUpdateLecture}
        size={20}
        className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      />
    </div>
  );
};

export default Lecture;





// import { Edit } from "lucide-react";
// import React from "react";
// import { Navigate, useNavigate } from "react-router-dom";

// const Lecture =({lecture,courseId,index})=>{
    
//     const nevigate=useNavigate();

//     const goToUpdateLecture = () => {
//         Navigate(`/admin/course/${courseId}/lecture/${lecture._id}`)
//       };

//  return (
//     <div className="flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2">
//     <h1 className="font-bold text-gray-800 dark:text-gray-100">
//       Lecture - {index+1}: {lecture.lectureTitle}
//     </h1>
//     <Edit
//       onClick={goToUpdateLecture}
//       size={20}
//       className=" cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
//     />
//   </div>
// );
// };

// export default Lecture;
