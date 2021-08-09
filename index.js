import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import ejsMate from 'ejs-mate'
import methodOverride from 'method-override'
import path, { dirname } from 'path'
import Product from './models/product.js'
const port = 3000
const app = express()
app.use("ejs",ejsMate)
let __dirname = path.resolve(path.dirname(''));

app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/contact', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connection Success")
});

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/products',async (req, res) => {
    const productlist=await Product.find({})
    res.render('index',{productlist})
})

app.get('/products/:id',async (req,res)=>{
    const { id }=req.params
    const p=await Product.findById(id)
    res.render("show",{p})
})

app.get('/productsnew/new',(req,res)=>{

    res.render('new')
})

app.post('/products', async(req,res)=>{
    const newproduct=new Product(req.body)
    await newproduct.save()
    res.redirect(`/products/${newproduct._id}`)
})

app.post('/products/:id/delete', async(req,res)=>{
    const { id }=req.params
    const deleteproduct=await Product.findByIdAndDelete(id)
    res.redirect(`/products`)
})

app.get('/products/:id/edit',async (req,res)=>{
    const { id }=req.params
    const edit= await Product.findById(id)
    res.render('edit',{edit})
})

app.post('/products/:id',async (req,res)=>{
    const { id }=req.params
    const edited= await Product.findByIdAndUpdate(id,req.body,{runValidators:true})
    res.redirect(`/products/${edited._id}`)
})

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})