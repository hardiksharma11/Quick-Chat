const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const { Schema } = mongoose;

const userModel = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        pic: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'

        }
    },
    {
        timestamps: true
    }
)

userModel.method({
    async passMatch(enteredPass) {
        return (await bcrypt.compare(enteredPass, this.password));
    }
})

userModel.pre('save', async function(next){
    if (!this.isModified()) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userModel);
module.exports = User;