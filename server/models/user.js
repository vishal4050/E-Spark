import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
         type:String,
         default:"user",
    },
    mainrole:{
          type:String,
          default:"user",
    },
    subscription:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    resetPasswordExpire:Date,
},
{
    timestamps: true
}
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);