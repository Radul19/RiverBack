
import User from '../models/userSchema'
import Item from '../models/itemSchema'
import Commerce from '../models/commerceSchema'
import debugg from '../helpers/debug'
import { deleteImage, deleteImages, uploadImage, uploadImages } from '../helpers/uploadImages'
import { Request, Response } from 'express'
import Code from '../models/codeSchema'


type Image = { secure_url: string, public_id: string }
type ReqRes = (req: Request, res: Response) => void

export const registerCommerce: ReqRes = async (req, res) => {
    if (debugg) console.log('#registerCommerce')
    let aux: Image[] = []
    try {
        const { name, owner_id, logo, description, email, address, rif, telegram, instagram, messenger, whatsapp, phone, code } = req.body
        const { secure_url, public_id } = await uploadImage(logo)
        aux.push({ public_id, secure_url: '_' })
        const newCommerce = await Commerce.create({
            name, owner_id, description, email, address, rif, socials: {
                telegram, instagram, messenger, whatsapp
            }, phone,
            logo: secure_url, logo_id: public_id,
        })

        await User.findOneAndUpdate({ _id: owner_id }, { $set: { commerce: newCommerce._id } })
        await Code.findOneAndUpdate({ code, enable: true }, { $set: { enable: false, user_id: owner_id } })

        res.send(newCommerce)

    } catch (error: any) {
        if (aux.length > 0) await deleteImages(aux)
        res.status(400).json({ msg: error.message })
    }
}

export const editMarketData: ReqRes = async (req, res) => {
    if (debugg) console.log('#editMarketData')
    try {
        const { market_id, name, phone, description, email, address, rif, socials, logo = undefined, logo_id, schedules } = req.body
        let market
        if (logo) {
            let { secure_url, public_id } = await uploadImage(logo)
            await deleteImage(logo_id)
            market = await Commerce.updateOne({ _id: market_id }, { $set: { name, email, phone, description, address, rif, socials, logo: secure_url, logo_id: public_id, schedules } })
        } else {
            market = await Commerce.updateOne({ _id: market_id }, { $set: { name, email, phone, description, address, rif, socials, schedules } })
        }
        if (market.matchedCount > 0) res.send(market)
        else res.send(false)
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}



export const createItem: ReqRes = async (req, res) => {
    if (debugg) console.log('#createItem')
    let aux: Image[] = []
    try {
        const { name, description, owner_id, images, categories, price } = req.body
        const imagesInfo = await uploadImages(images)
        let arrImg: Image[] = []
        imagesInfo.forEach((img: Image) => {
            arrImg.push({
                secure_url: img.secure_url,
                public_id: img.public_id,
            })
            aux.push({ public_id: img.public_id, secure_url: '_' })
        });

        const newItem = await Item.create({
            name, description, owner_id, categories, images: arrImg, price,
        })

        res.send(newItem)

    } catch (error: any) {
        if (aux.length > 0) await deleteImages(aux)
        res.status(400).json({ msg: error.message })
    }
}

export const updateItem: ReqRes = async (req, res) => {
    if (debugg) console.log('#updateItem')
    try {
        const { name, price, description, images, _id,owner_id } = req.body
        // console.log(images);

        const imgs = await uploadImages(images)
        const result1 = await Item.findOneAndUpdate({ _id }, {
            $set: { name, price, description,images:imgs }
        })
        if(result1){
            const result2 = await Item.find({owner_id   })
            res.send(result2)
        }else{
            res.status(400).json({ msg: 'No se ha podido actualizar el articulo' })
        }
        // res.send({ok:true})
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteItem: ReqRes = async (req, res) => {
    if (debugg) console.log('#deleteItem')
    try {
        const { item_list } = req.body
        const items = await Item.find({_id:{$in:item_list}})
        let auxImgs:any = []
        if(items){
            items.forEach(itm => {
                itm.images.forEach(itmigs => {
                    auxImgs.push(itmigs)
                });
            });
        }
        await deleteImages(auxImgs)
        await Item.deleteMany({_id:{$in:item_list}})
        res.send({ok:true})
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}

