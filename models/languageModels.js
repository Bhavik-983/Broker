import mongoose from "mongoose";
const Schema = mongoose.Schema

const languageSchema = new Schema({
    name: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    key: {
        type: String
    }
},
    { timestamps: true }
)
export const languageModels = mongoose.model("languages", languageSchema)

