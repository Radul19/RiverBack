//@ts-ignore
import bcrypt from "bcrypt";
//@ts-ignore
import { sign } from "jsonwebtoken";

import { Request, Response } from "express";
import debugg from "../helpers/debug";
import User from "../models/userSchema";
import Item from "../models/itemSchema";
import Commerce from "../models/commerceSchema";
import { Types } from "mongoose";
const ObjectId = (val: string) => {
  return new Types.ObjectId(val);
};
type ReqRes = (req: Request, res: Response) => void;

export const test: ReqRes = (req, res) => {
  if (debugg) console.log("#test");

  // console.log(filter.clean("What an asshole"))
  res.send("WORKING");
};

export const login: ReqRes = async (req, res) => {
  if (debugg) console.log("#login");
  try {
    const { email, password: pass } = req.body;

    console.log(email);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Correo incorrecto" });

    bcrypt.compare(pass, user.password, function (_: any, result: any) {
      if (!result)
        return res.status(401).json({ msg: "Contraseña incorrecta" });
      user.populate("commerce");
      console.log(user.commerce);
      const { name, email, avatar, card_id, commerce, _id } = user;
      let token = sign(
        { data: user._id, exp: Math.floor(Date.now() / 1000 + 2592000) },
        process.env.SECRET
      );
      return res.send({ name, email, avatar, card_id, commerce, token, _id });
    });
  } catch (error: any) {
    res.status(404).json({ msg: error.message });
  }
};

export const register: ReqRes = async (req, res) => {
  if (debugg) console.log("#register");
  try {
    const { name, email, card_id, password: pass, avatar } = req.body;

    let password = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));

    let findEmail = await User.findOne({ email });
    let findCardId = await User.findOne({ card_id });

    if (findEmail)
      return res.status(409).json({ msg: "El correo ya esta en uso" });
    if (findCardId)
      return res.status(409).json({ msg: "La cedula ya esta en uso" });

    const newUser = await User.create({
      name,
      email,
      card_id,
      password,
      avatar,
    });
    let token = sign(
      { data: newUser._id, exp: Math.floor(Date.now() / 1000 + 2592000) },
      process.env.SECRET
    );
    // console.log(token)
    const {
      name: n,
      email: e,
      avatar: a,
      card_id: ci,
      commerce,
      _id,
    } = newUser;

    res.send({
      name: n,
      email: e,
      avatar: a,
      card_id: ci,
      commerce,
      token,
      _id,
    });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
};

export const getItem: ReqRes = async (req, res) => {
  if (debugg) console.log("#getItem");
  const { id } = req.params;

  const result = await Item.findOne({ _id: id }).populate(
    "reviews.user commerce",
    "name avatar logo schedules"
  );
  if (result) res.send(result);
  else res.status(404).json({ msg: "Elemento no encontrado" });
};
export const getMarket: ReqRes = async (req, res) => {
  if (debugg) console.log("#getMarket");
  const { id } = req.params;

  const shop = await Commerce.findOne({ _id: id });
  const items = await Item.find({ owner_id: id }).populate(
    "reviews.user",
    "name avatar"
  );
  if (shop) res.send({ shop, items });
  else res.status(404).json({ msg: "Elemento no encontrado" });
};

export const searchItems: ReqRes = async (req, res) => {
  if (debugg) console.log("#searchItems");
  try {
    const { text = false, categories = false, commerce = false } = req.body;
    const markets = categories ? categories.includes("market") : false;
    if (markets) {
      categories.splice(categories.indexOf("market"), 1);
      const result = await Commerce.find({
        $or: [
          { name: text ? new RegExp(text, "i") : { $exists: true } },
          { description: text ? new RegExp(text, "i") : { $exists: true } },
        ],
        categories:
          categories && categories.length > 0
            ? { $in: categories }
            : { $exists: true },
        commerce: commerce ? ObjectId(commerce) : { $exists: true },
      });
      return res.send(result);
    } else {
      const items = await Item.find({
        $or: [
          { name: text ? new RegExp(text, "i") : { $exists: true } },
          { description: text ? new RegExp(text, "i") : { $exists: true } },
        ],
        categories: categories ? { $in: categories } : { $exists: true },
        commerce: commerce ? ObjectId(commerce) : { $exists: true },
      }).populate("reviews.user commerce", "name avatar logo schedules");
      return res.send(items);
    }
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

export const download: ReqRes = async (req, res) => {
  const file = `${__dirname}/riverV0.1.1.apk`;
  res.download(file); // Set disposition and send it.
};
