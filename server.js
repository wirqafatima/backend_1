import express from 'express'
const app = express();
import multer from 'multer'
import path from 'path'
import mongoose from 'mongoose'
import 'dotenv/config'
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
    res.json({
        message: "Hello world"
    })
})


app.post("/profile/:name/:age/:city", (req, res) => {
    const { name, age, city } = req.params
    const email = req.query.email
    if (!name || !age || !city || !email)
        return res.status(400).json({ message: "please enter all fields" })
    res.status(200).json({
        message: `My name is ${name} ,I am ${age} years old , I am from ${city} , My email address is ${email}`
    })
})

app.post('/users/create', (req, res) => {

    const { name, email, age, password } = req.body;


    if (!name || !email || !age || !password) {
        return res.status(400).json({ error: '  All fields must be filled.' });
    }




    res.status(200).json({
        message: 'User created successfully', user: req.body,

    });
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        // path.extname asli extension (.jpg / .png) khud hi nikal leta hai
        // const ext = "." + file.mimetype.split("/")[1];
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// app.post("/upload", upload.single("image"), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: "Please upload an image" });
//     }
//     console.log(req.file)
//     res.json({ data: req.file.filename })
// })




async function main() {
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

main();


app.post("/upload", upload.single("picture"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Please upload picture" });
    }
    console.log(req.file)
    res.json({ data: req.file.filename })
})







const userSchema = new mongoose.Schema({
    userName: {
        type: String, minLength: 3, maxLength: 20, required: true
    },
    email: {
        type: String, required: true, unique: true, lowercase: true
    },
    phone: {
        type: String, required: true, unique: true
    },
    age: {
        type: Number, required: true,
    },
    address: {
        type: String, requred: true
    },
    password: {
        type: String, minLength: 5, maxLength: 20, required: true, select: false
    },
    picture: {
        type: String, required: true
    }

}, { timestamps: true })


const userModel = new mongoose.model("User", userSchema)

app.post("/user", upload.single("picture"), async (req, res) => {
    const { userName, email, password, age, address, phone } = req.body

    if (!userName || !email || !age || !password || !address || !phone)
        return res.status(400).json({
            success: false,
            message: "please enter all fields"
        })
    if (!req.file)
        return res.status(400).json({
            success: false,
            message: "picture is required"
        })
    const user = await userModel.create({
        email,
        address,
        password,
        age,
        phone,
        userName,
        picture: req.file.filename
    })

    return res.status(200).json({
        success: true,
        message: "user created successfully"
    });
})









app.listen(5000, () => {
    // main()
    console.log("Server started on port 5000")
})
