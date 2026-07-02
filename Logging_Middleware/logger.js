require("dotenv").config();
const axios=require("axios");
const LOG_API = "http://4.224.186.213/evaluation-service/logs";
async function Log(stack, level, packageName, message) {
    try {
        const response = await axios.post(
            LOG_API,
            {
                stack,
                level,
                package: packageName,
                message,
            },
            {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN}`,
                "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Logging failed:",
            error.response?.data || error.message
        );
    }
}
module.exports = Log;