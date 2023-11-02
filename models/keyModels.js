import mongoose from "mongoose";
const Schema = mongoose.Schema
const keySchema = new Schema({
    key: {
        type: String
    },
    language: [
        {
            lg: {
                type: mongoose.Schema.ObjectId,
                ref: "languages"
            },
            value: {
                type: String
            }
        }
    ],
    status: {
        type: Boolean,
        default: true
    },
    page_id: {
        type: mongoose.Schema.ObjectId,
        ref: "pages"
    }

},
    { timestamps: true }
)

export const keyModel = mongoose.model("keys", keySchema)