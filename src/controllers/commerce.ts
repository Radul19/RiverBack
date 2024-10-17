
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
        const { name, owner_id, logo, description, email:eml,categories, address, delivery,rif, socials,phone, code } = req.body
        const email = eml.toLowerCase()
        const { secure_url, public_id } = await uploadImage({secure_url:logo,public_id:''})
        aux.push({ public_id, secure_url: '_' })
        const newCommerce = await Commerce.create({
            name, owner_id, description, email, address, delivery,rif,socials, phone,
            logo: secure_url, logo_id: public_id,categories
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
        const { market_id, name, phone, description, email:eml, address, categories,rif, socials,delivery, logo, logo_id, schedules } = req.body
        const email = eml.toLowerCase()
        let { secure_url, public_id } = await uploadImage({secure_url:logo,public_id:logo_id})
        const market = await Commerce.findOneAndUpdate({ _id: market_id }, { $set: { name, email, phone, description, address, rif, socials, delivery,schedules,logo: secure_url, logo_id: public_id,categories } },{new:true})
        if (market) res.send(market)
        else res.status(400).json({ msg: "Comercio no encontrado" })
    } catch (error: any) {
        res.status(400).json({ msg: error.message })
    }
}



export const createItem: ReqRes = async (req, res) => {
    if (debugg) console.log('#createItem')
    let aux: Image[] = []
    try {
        const { name, description, commerce, images, categories, price } = req.body
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
            name, description, commerce, categories, images: arrImg, price,
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

/**
 * // let market
        // if (logo) {
        //     let { secure_url, public_id } = await uploadImage({secure_url:logo,public_id:logo_id})
        //     // await deleteImage(logo_id)
        //     market = await Commerce.updateOne({ _id: market_id }, { $set: { name, email, phone, description, address, rif, socials, logo: secure_url, logo_id: public_id, schedules } })
        // } else {
        //     market = await Commerce.updateOne({ _id: market_id }, { $set: { name, email, phone, description, address, rif, socials, schedules } })
        // }
 */