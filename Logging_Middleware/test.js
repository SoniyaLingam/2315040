const { Log } = require("./index");
async function test() {
    const result = await Log(
        "backend",
        "info",
        "service",
        "Logging middleware is working"
    );
    console.log(result);
}
test();