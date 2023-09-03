const mongoose = require('mongoose');
const express = require('express');
const app = express();
const {v4:uuidv4} = require('uuid');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

const uri = "mongodb+srv://mongodb:1@react-db.nhsnnba.mongodb.net/"
mongoose.connect(uri).then(res => {
    console.log('db connect')
})
.catch(err => {
    console.log('db is error')
})

const userSchema = new mongoose.Schema({
    _id:String,
    name:String,
    email:String,
    password:String,
    isAdmin:Boolean,
})

const User = mongoose.model("User",userSchema);

const productSchema = new mongoose.Schema({
    _id:String,
    name:String,
    stock:Number,
    price:Number,
    categoryName:String,
    imageUrl:String
})

const Product = mongoose.model("Product",productSchema);

const basketSchema = new mongoose.Schema({
    _id:String,
    productId:String,
    userId:String,
})

const Basket = mongoose.model("Basket",basketSchema);

const orderSchema = new mongoose.Schema({
    _id:String,
    productId:String,
    userId:String,
})

const Order = mongoose.model("Order",orderSchema);

const secretKey = 'Gizli Anahtarım Gizli Anahtarım Gizli Anahtarım';
const options = {
    expiresIn: '1h'
};



app.post("/auth/register", async (req,res)=>{
    try {
        const {name,email,password} = req.body
        let user = new User({
            _id:uuidv4(),
            name:name,
            email:email,
            password:password,
            isAdmin:false
        })
      await user.save();
        const payload = {
            user: user,
        }
        const token = jwt.sign(payload,secretKey,options)
        res.json({user:user,token:token})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

app.post('/auth/login',async (req,res) =>{
    try {
        const {email,password} = req.body;
        const users = await User.find({email:email,password:password})
       if (users.length === 0){
            res.status(500).json({message: 'Mail Adresi Veya Şifre Yanlış'})
        } else {
           const payload = {
               user: users[0],
           }
           const token = jwt.sign(payload,secretKey,options)
           res.json({user:users[0],token:token})
       }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
} )

app.get('/products', async (req,res) => {
    try {
        const products = await Product.find({}).sort({name:1})
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'uploads/')
    },
    filename:function (req,file,cb){
        cb(null,Date.now() + '-' +file.originalname)
    },
})

const upload =multer({storage:storage})


app.post('/products/add',upload.single('image'),async (req,res) => {
    try {
        const {name,categoryName,stock,price} = req.body;
        const product = new Product({
            _id:uuidv4(),
            name:name,
            stock,stock,
            price:price,
            categoryName:categoryName,
            imageUrl: req.file.path
        })

        await product.save();
        res.json({message:'Ürün Başarıyla Kaydedilmiştir'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/products/remove', async (req,res) => {
    try {
        const {_id} = req.body;
        await Product.findByIdAndRemove(_id);
        res.json({message:'Silme İşlemi Başarıyla Gerçekleşti'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/baskets/add', async (req,res)=>{
    try {
        const {productId,userId} = req.body;
        let basket = new Basket({
            _id : uuidv4(),
            userId : userId,
            productId: productId
        })
        await basket.save();

        let product = await Product.findById(productId)
        product.stock = product.stock - 1 ;
        await Product.findByIdAndUpdate(productId,product);
        res.json({message : 'Ürün sepete eklendi'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/baskets/getAll',async (req,res) => {
    try {
        const {userId} = req.body;
        const baskets = await Basket.aggregate([
            {
                $match:{
                    userId:userId
                }
            },
            {
                $lookup:{
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'products'
                }
            }
        ])
        res.json(baskets);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.post('/baskets/remove',async (req,res)=>{
    try {
        const {_id} = req.body;
        const basket = await Basket.findById(_id);
        const product = await Product.findById(basket.productId);
        product.stock += 1;
        await Product.findByIdAndUpdate(_id);
        await Basket.findByIdAndRemove(_id);
        res.json({message:'Silme işlemi başarılı'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/orders/add',async (req,res)=>{
    try {
        const {userId} = req.body
        const baskets = await Basket.find({userId:userId})
        for (const item of baskets) {
            let order = new Order({
                _id: uuidv4(),
                productId:item.productId,
                userId:userId,
            });
            order.save();
            await Basket.findByIdAndRemove(item._id)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/orders', async (req,res) => {
    try {
    const {userId} = req.body;
    const orders = await Order.aggregate([
        {
            $match:{userId:userId}
        },
        {
            $lookup:{
                from:'products',
                localField:'productId',
                foreignField:'_id',
                as:'products'
            }
        }
    ])

        res.json(orders);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

const port = 5000;
app.listen(5000, ()=>{
    console.log("uygulama http://localhost:" + port + " üzerinde ayakta")
});