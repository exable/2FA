import { MONGO_URL } from '$env/static/private';
import mongoose from 'mongoose';

// Connect to MongoDB before starting the server
mongoose.connect(MONGO_URL).then(() => {
    console.log("MongoDB started");
}).catch((e) => {
    console.log("MongoDB failed to start");
    console.log(e);
});