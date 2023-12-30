import mongoose from 'mongoose'
/**@type {import "mongoose".Model} */
export let accounts = mongoose.model('account', new mongoose.Schema({
    name: { type: String, required: true },
    secret: { type: String, required: true },
    notes: { type: String }
}))