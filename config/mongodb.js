const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url =
  "mongodb+srv://new-user_31:admin@cluster0.2kvs5.mongodb.net/miniproject_mini?retryWrites=true&w=majority";

const connect = async function () {
  try {
    MongoClient.connect(url, function (error, client) {
      assert.equal(null, error);
      console.log(`Connect successfully to mongodb server`);
      const db = client.db("miniproject_db");
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  connect,
  url,
};