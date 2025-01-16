const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
app.use(bodyParser.json({ extend: true }))
app.use(cors())
const multer = require("multer")
const { uid } = require("uid")
const map_handler = require("./map_handler")
const fs=require("fs")
const multer_config = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/voices`)
    },
    filename: function (req, file, cb) {
        let file_id = uid(8)
        const format = file.originalname.split(".").at(-1)
        req.body.id = file_id
        req.body.format = format
        cb(null, file_id + '.' + format)
    }
})

const upload = multer({ storage: multer_config })
app.use("/voices",express.static("./voices"))

app.post("/upload_voice", upload.single("voice"), (req, res) => {
    const { id, format } = req.body
    const path = `https://nutrostyle.nutrosal.com:3545/voices/${id}.${format}`
    const new_file = {
        submit_at: Date.now(),
        path,
        content: "",
        id,
        name: req.file.originalname,
        type: "voice"
    }
    map_handler.add_to_map(new_file)
    res.json(true)
})

app.get("/get_list", (req, res) => {
    const json = map_handler.get_map()
    res.json(json)
})

app.post("/submit_question", (req, res) => {
    const { content } = req.body
    const new_file = {
        submit_at: Date.now(),
        path: null,
        content,
        id:uid(8),
        name:"Question",
        type:"text"
    }
    map_handler.add_to_map(new_file)
    res.json(true)

})

app.delete("/delete/:id",(req,res)=>{
    const {id}=req.params
    map_handler.remove_from_map(id)
    res.json(true)
})

const https = require("https")
const conf = {
    key: fs.readFileSync("/etc/letsencrypt/live/nutrostyle.nutrosal.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/nutrostyle.nutrosal.com/fullchain.pem")
}
const server = https.createServer(conf, app)
server.listen("3545")