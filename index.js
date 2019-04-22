const redis = require("./redis");

async function test() {
  let res = await redis.orderId( "name");
  console.log(res)
}

test()
