import {Schema,model, SchemaTypes} from 'mongoose'
const objId = SchemaTypes.ObjectId


const CommerceSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        description: { type: String, required: true },
        owner_id: { type: String, required: true },
        logo: { type: String,required:true},
        logo_id: { type: String,required:true},
        email: { type: String},
        address: { type: String},
        rif: { type: String},
        reviews: [{
            type: new Schema(
                {
                    user: { type: objId, ref: 'User', required: true },
                    text: { type: String, required: true },
                    stars: { type: Number, required: true },
                },
                { timestamps: true }

            )
        }],
        socials:{
            telegram:{type:String},
            whatsapp:{type:String},
            messenger:{type:String},
            instagram:{type:String},
        },
        schedules:{type:Array, default:[] },
        categories:{type:Array, default:[] },
        favorites:{type:Array, default:[] }
    },
    {
        timestamps: true,
    }
);

export default model('Commerce',CommerceSchema)

// module.exports = model('Item', ItemSchema)
