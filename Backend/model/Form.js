import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // -> RELASI TABLE FORMS KE TABLE USERS
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    questions: {
      type: Array,
    },
    invites: {
      type: Array, // ['jhondoe@example.com']
    },
    public: {
      type: Boolean, // true = public, false = private
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
    strict: false,
  }
);

Schema.plugin(mongoosePaginate);

// RELASI TABLE FORM KE TABLE ANSWER
Schema.virtual("answers", {
  ref: "Answer", // -> referensi ke model apa? ke model Answer
  localField: "_id", // -> _id yang ada di databse form, lihat database : _id -> PRIMARY KEY
  foreignField: "formId", // -> formId yang ada di model Answer -> FOREIGN KEY
});

export default mongoose.model("Form", Schema);
