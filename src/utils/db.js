import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mangoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE);
        console.log("db success");
    } catch (error) {
        console.error("connection failed", error.message);
    }
};

export default mangoDB; 