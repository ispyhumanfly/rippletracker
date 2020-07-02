import { Router } from "express"

const index = Router()

index.get("/test", (req, res) => {
    res.json({ success: true })
})

index.get("/test2", (req, res) => {
    res.json({ success: true })
})

export default index
