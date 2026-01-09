import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    subTitle: {type:String}, 
    description:{ type:String},
    category:{
        type:String,
        required:true
    },
    courseLevel:{
        type:String,
        enum:["Beginner", "Medium", "Advance"]
    },
    coursePrice:{
        type:Number
    },
    courseThumbnail:{
        type:String
    },
    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isPublished:{
        type:Boolean,
        default:false
    }

}, {timestamps:true});

export const Course = mongoose.model("Course", courseSchema);











// import mongoose from "mongoose";

// const courseSchema = new mongoose.Schema({
//     coursetitle: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     lecture:[
//         {
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"Lecture"
//         }
//     ],
//     instructor: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     enrolledStudents: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     price: {
//         type: Number,
//         default: 0
//     },
//     thumbnail: {
//         type: String,
//         default: ""
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     level: {
//         type: String,
//         enum: ['beginner', 'intermediate', 'advanced'],
//         default: 'beginner'
//     },
//     isPublished: {
//         type: Boolean,
//         default: false
//     },
//     rating: {
//         type: Number,
//         default: 0
//     },
//     totalRatings: {
//         type: Number,
//         default: 0
//     }
// }, {
//     timestamps: true
// });

// export const Course = mongoose.model("Course", courseSchema); 