import mongoose from 'mongoose'
const Schema = mongoose.Schema
const websiteSchema = new Schema({
  name: {
    type: String
  },
  status: {
    type: Boolean,
    default: true
  },
  pages: [{
    type: mongoose.Schema.ObjectId,
    ref: 'pages'
  }
  ],
  languages: [{
    type: mongoose.Schema.ObjectId,
    ref: 'languages'
  }]

},
{ timestamps: true }
)
export const websiteModels = mongoose.model('websites', websiteSchema)
