import express from 'express'
const app = express();


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

app.listen(3001, () => {
    console.log("Server started on port 3001")
})