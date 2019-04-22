const express = require("express");
const mysql = require("mysql");
const redis = require("redis");
const client = redis.createClient();

client.on("error", function(err) {
  console.error("Error:", err);
});

client.on("connect", function() {
  console.log("Redis连接成功");
});

/**
 * 添加string类型的数据
 * @param key 键
 * @params value 值
 * @params expire (过期时间,单位秒;可为空，为空表示不过期)
 * @param callBack(err,result)
 */

function set({ key, value, expire }) {
  return new Promise((resolve, reject) => {
    client.set(key, value, function(err, result) {
      if (err) {
        console.log(err);
        reject(err, null);
        return;
      }
      if (!isNaN(expire) && expire > 0) {
        client.expire(key, parseInt(expire));
      }
      resolve(result);
    });
  });
}

/**
 * 查询string类型的数据
 * @param key 键
 * @param callBack(err,result)
 */
function get(key) {
  return new Promise((resolve, reject) => {
    client.get(key, function(err, result) {
      if (err) {
        console.log(err);
        reject(err, null);
        return;
      }
      resolve(result);
    });
  });
}

/**
 * 查询是否存在
 * @param key 键
 * @param callBack(err,result)
 */
function exists(key) {
  return new Promise((resolve, reject) => {
    client.exists(key, function(err, result) {
      if (err) {
        console.log(err);
        reject(err, null);
        return;
      }
      resolve(result);
    });
  });
}

function orderId() {
  return new Promise(async (resolve, reject) => {
    let time = new Date();
    let second = time.getTime();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let result = await exists("orders");

    if (!result) {
      // 第一次进入生成id
      set("orders", second);
    } else {
      client.INCR("orders"); // 每次自增
      let res = await get("orders");
      console.log(res)
      // 得到id 回调上传
      res = res + "" + year + month + date;
      resolve(res);
    }
  });
}
module.exports = {
  set,
  get,
  exists,
  orderId
};
