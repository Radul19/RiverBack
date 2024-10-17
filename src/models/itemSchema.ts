import { Schema, model, SchemaTypes } from 'mongoose'
const objId = SchemaTypes.ObjectId

const ItemSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
        commerce: { type: objId, ref: 'Commerce', required: true },
        categories: { type: Array, required: true },
        // units: { type: String, required: true },
        favorites: { type: Array, default: [] },
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
        images: [{
            secure_url: String,
            public_id: String,
        }],
    },
    {
        timestamps: true,
    }
);

export default model('Item', ItemSchema)

// module.exports = model('Item', ItemSchema)
