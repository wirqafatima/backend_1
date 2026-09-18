import express from 'express'
const app = express();

app.use(express.json());
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

app.listen(3001, () => {
    console.log("Server started on port 3001")
})