const express = require('express');
const redis = require('redis');
const axios = require('axios');

const app = express();
const redisClient = redis.createClient();

if (redisClient.exists('testdata')) {
    redisClient.del('testdata');
}

function elapsedTime(fromD) {
    const endD = new Date();
    return ("Response Time : " + (endD.getTime() - fromD.getTime()).toString() + " ms");
}

app.get('/', async (req, res) => {
    const fromD = new Date();
    redisClient.get('testdata', async (error, response) => {
        if (error) console.error(error);
        if (response != null) {
            console.log("Cache Found");
            console.log(elapsedTime(fromD))
            return res.json(JSON.parse(response));
        }
        console.log("Cache Not Found");
        const { data } = await axios.get("https://api.publicapis.org/entries"); //SAMPLE DATA FROM A PUBLIC API
        redisClient.setex('testdata', 100, JSON.stringify(data));
        console.log(elapsedTime(fromD))
        return res.json(data);
    });
});

app.listen(6969, () => {
    console.log('listening on port 6969');
});
