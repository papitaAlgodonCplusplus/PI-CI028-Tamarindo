import express from "express";
import { addCardPayment, addPayment, getCards, getPaymentsByUser, addBankPayment, addCashPayment, getPaymentByID } from "../controllers/payment.js";

const router = express.Router()

router.post("/add_card_payment", addCardPayment)
router.post("/add_bank_payment", addBankPayment)
router.post("/add_cash_payment", addCashPayment)
router.post("/add_payment", addPayment)
router.get("/payment_byPaymentID:paymentID", getPaymentByID)
router.get("/paymentsByUserId:userID", getPaymentsByUser)
router.get("/creditCards:userID", getCards)
export default router