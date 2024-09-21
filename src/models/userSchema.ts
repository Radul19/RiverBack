// const { Schema, model } = require('mongoose')
import {Schema,model,SchemaTypes} from 'mongoose'
const objId = SchemaTypes.ObjectId

// const defaultProfile = 'https://res.cloudinary.com/deliveryplanet/image/upload/v1674949797/user_twylfd.png'

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: Number, required: true },
        card_id: { type: String, required: true },
        commerce: { type: objId, ref: 'Commerce',default:null },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.changeName = function () {
    // console.log(`Testing name here ${this.name}`)
    return this.name = 'Testing here'
}
UserSchema.methods.presignedProfile = async function () {
    return this
}

export default model('User', UserSchema)

