import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" }, 
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" }, 
    answer: { type: String, required: true } 
}, { timestamps: true }); 

const Answer = mongoose.models.Answer || mongoose.model("Answer", AnswerSchema, "answers");
export default Answer;