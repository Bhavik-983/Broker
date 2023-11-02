import mongoose from "mongoose";
const Schema = mongoose.Schema
const pageSchema = new Schema({
    name: {
        type: String
    },
    keys: [{
        type: mongoose.Schema.ObjectId,
        ref: "keys"
    }],
    status: {
        type: Boolean,
        default: true
    },
    website_id: {
        type: mongoose.Schema.ObjectId,
        ref: "websites"
    }


},
    { timestamps: true }

)
// pageSchema.index({ name: 1 }, { unique: true })
export const pageModels = mongoose.model("pages", pageSchema)