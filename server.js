require('dotenv').config()
const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')


app.use(express.json());
app.use(cors());
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))


app.get("/", (req, res) => {
    res.send("Hello...");
});

app.listen(port, () => console.log(`app listening on port ${port}`));