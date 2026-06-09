import express from 'express'
import { createOrder } from './PhonePay.js'

const router = express.Router()

router.post('/createOrder',createOrder)

export default router