import express from 'express'
import routeGuest from './src/routes/guest.routes'
import routeUser from './src/routes/user.routes'
import routeCommerce from './src/routes/commerce.routes'
//@ts-ignore
import cors from 'cors'
import './db'
const app = express()

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: "*",
}));



app.use(routeGuest)
app.use(routeUser)
app.use(routeCommerce)

app.listen(4000, () => {
    console.log('Server listen on port', 4000)
})