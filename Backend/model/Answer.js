import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    strict: false, // USER BISA MEMBUAT FIELD SEBEBASNYA
    // TIDAK HANYA 4 FIELD DI ATAS
    // FIELD YANG AKAN DIGUNAKAN QUESTION ID
  }
);

export default mongoose.model("Answer", Schema);
