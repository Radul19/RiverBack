import {Schema,model} from 'mongoose'

const CodeSchema = new Schema(
    {
        code: { type: String, required: true },
        enable: { type: Boolean, required: true,default:true },
        user_id: { type: String, required: true,default:'_' },
    },
    {
        timestamps: true,
    }
);

export default model('Code',CodeSchema)