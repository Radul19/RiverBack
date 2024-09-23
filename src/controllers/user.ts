//@ts-ignore
import bcrypt from 'bcrypt'
//@ts-ignore
import { sign, verify } from "jsonwebtoken"
//@ts-ignore
import cloudinary from '../helpers/cloudinary'
//@ts-ignore
import { Spot } from "@binance/connector";
//@ts-ignore
import Filter from 'bad-words-es'

import User from "../models/userSchema"
import Commerce from "../models/commerceSchema";
import Item from "../models/itemSchema"
import Code from "../models/codeSchema"
import { Request, Response } from "express";
import debugg from "../helpers/debug";
const filter = new Filter()

type ReqRes = (req: Request, res: Response) => void




export const searchFavorites: ReqRes = async (req, res) => {
    if (debugg) console.log('#searchFavorites')
    try {
        const { text = false, user_id } = req.body
        const project = { favorites: 0 }
        let result = {
            items: await Item.find({ $or: [{ name: text ? new RegExp(text, "i") : { $exists: true } }, { description: text ? new RegExp(text, "i") : { $exists: true }, }], favorites: { $in: user_id } }, project)
            , markets: await Commerce.find({ $or: [{ name: text ? new RegExp(text, "i") : { $exists: true } }, { description: text ? new RegExp(text, "i") : { $exists: true }, }], favorites: { $in: user_id } }, project)
        }
        res.send(result)
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}


export const editUserData: ReqRes = async (req, res) => {
    if (debugg) console.log('#editUserData')
    try {
        const { user_id, email, name, avatar, password = false } = req.body
        const user = await User.updateOne({ _id: user_id }, { $set: { name, email, avatar } })
        if (user.matchedCount > 0) res.send(true)
        else res.send(false)
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}

export const existCode: ReqRes = async (req, res) => {
    if (debugg) console.log('#existCode')
    const { code } = req.body
    const result = await Code.findOne({ code, enable: true })
    if (result) res.send(true)
    else res.status(400).json({ msg: 'Codigo incorrecto' })

}

export const createCode: ReqRes = async (req, res) => {
    if (debugg) console.log('#createCode')
    try {
        let code = Math.floor(Math.random() * (999999 - 100000) + 100000)
        let result = await Code.create({ code })
        res.send(result)

    } catch (error: any) {
        res.status(400).json(error.message)

    }

}

export const validateToken: ReqRes = async (req, res) => {
    if (debugg) console.log('#validateToken')
    const { token } = req.body
    try {
        verify(token, process.env.SECRET, async (err: any, decoded: any) => {
            try {
                if (err) return res.status(400).json({ msg: 'Token expirado' })
                else {
                    const findUser = await User.findOne({ _id: decoded.data }, { password: 0 }).populate('commerce')
                    if (findUser) return res.send(findUser)
                    else return res.status(404).json({ msg: 'Usuario no encontrado' })
                }
            } catch (error: any) {

                res.status(400).json(error.message)
            }

        })
    } catch (error: any) {
        res.status(400).json(error.message)
    }
}

export const orderHistory: ReqRes = async (req, res) => {
    if (debugg) console.log('#orderHistory')
    try {
        const { owner_id, payment_id } = req.body

        const apiKey = process.env.BINANCE_API_KEY || ''
        const apiSecret = process.env.BINANCE_API_SECRET || ''
        const client = new Spot(apiKey, apiSecret)


        await client.payHistory(
            {
                startTime: 1706334673000,
                endTime: 1711518673000,
            }
        ).then((response: any) => {
            response.data.data.forEach((payment: any) => {
                if (payment.currency === "USDT" && payment.orderId === payment_id && payment.amount === '20') {
                    return res.send(payment)
                }
            });
            res.send('not ok')
        }).catch((error: any) => res.send(error.response.data))

        // paymentHistory.forEach(payment => {
        //     if(payment.currency === "USDT" && payment.orderId === payment_id && payment.amount === '20'){
        //         return res.send(payment)
        //     }
        // });
        // res.send('not ok')


    } catch (error: any) {
        res.status(400).json({msg:error.message})
    }
}

export const updateReview: ReqRes = async (req, res) => {
    if (debugg) console.log('#updateReview')
    try {
        const { user_id, text, stars, isEdit, item_id,market_id } = req.body

        if(market_id){
            if (!isEdit) {
                const result = await Commerce.findOneAndUpdate({ _id: item_id }, {
                    $push: { reviews: { user: user_id, text, stars } }
                }, { new: true }).populate('reviews.user','name avatar')
                res.send(result)
            } else {
                const result = await Commerce.findOneAndUpdate({ _id: item_id, 'reviews.user': user_id }, {
                    $set: { 'reviews.$.text': text, 'reviews.$.stars': stars }
                }, { new: true }).populate('reviews.user', 'name avatar')
                res.send(result)
            }
        }else{
            if (!isEdit) {
                const result = await Item.findOneAndUpdate({ _id: item_id }, {
                    $push: { reviews: { user: user_id, text, stars } }
                }, { new: true }).populate('reviews.user','name avatar')
                res.send(result)
            } else {
                const result = await Item.findOneAndUpdate({ _id: item_id, 'reviews.user': user_id }, {
                    $set: { 'reviews.$.text': text, 'reviews.$.stars': stars }
                }, { new: true }).populate('reviews.user', 'name avatar')
                res.send(result)
            }
        }


    } catch (error: any) {
        res.status(400).json({msg:error.message})
    }
}

export const itemFavorite: ReqRes = async (req, res) => {
    if (true) console.log('#itemFavorite')
    try {
        const { user_id, item_id, state } = req.body
        // console.log(req.body);
        if (!state) {
            await Item.findOneAndUpdate({ _id: item_id }, { $pull: { favorites: user_id } })
        } else {
            await Item.findOneAndUpdate({ _id: item_id }, { $push: { favorites: user_id } })
        }
        res.send({ ok: true })

    } catch (error:any) {
        res.status(400).json({ msg: error.message })
    }
}
export const marketFavorite: ReqRes = async (req, res) => {
    if (true) console.log('#marketFavorite')
    try {
        const { user_id, market_id, state } = req.body
        // console.log(req.body);
        if (!state) {
            await Commerce.findOneAndUpdate({ _id: market_id }, { $pull: { favorites: user_id } })
        } else {
            await Commerce.findOneAndUpdate({ _id: market_id }, { $push: { favorites: user_id } })
        }
        res.send({ ok: true })

    } catch (error:any) {
        res.status(400).json({ msg: error.message })
    }
}
// export const marketFavorite: ReqRes = async (req, res) => {
//     if (debugg) console.log('#marketFavorite')
//     try {
//         const { user_id, market_id, state } = req.body
//         if (state) {
//             await Commerce.findOneAndUpdate({ _id: market_id }, { $pull: { favorites: user_id } })
//         } else {
//             await Commerce.findOneAndUpdate({ _id: market_id }, { $push: { favorites: user_id } })
//         }
//         res.send({ ok: true })

//     } catch (error:any) {
//         res.status(400).json({ msg: error.message })
//     }
// }

// export const namehere : ReqRes = async (req,res)=>{
//     if(debugg) console.log('#namehere')
//     res.send('ok')
// }