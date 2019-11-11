const esClient = require('./client');
const fs = require('fs');
const cron = require('cron').CronJob;
const new_array = []
const all_index = ['activity_log']
const mongoDB = require('mongodb').MongoClient;
const db = "mytds"
const options = {
    poolSize: 50,
    keepAlive: 15000,
    socketTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const url_mongo = 'mongodb://localhost:27017'

const searchIndex = async function (indexName, payload) {
    const result = await esClient.search({
        index: indexName,
        body: payload
    });
    return result;
}

const getAllIndex = async () => {
    const indices = await esClient.cat.indices({ format: 'json' })
    console.log(indices);

    return indices;
}

// const readJsonFile = async () => {
//     const data = JSON.parse(fs.readFileSync('./catalog/activity_log_catalog.json'))}

const elastic = async (element) => {
    let allRecords = [];

    // first we do a search, and specify a scroll timeout
    var { _scroll_id, hits } = await esClient.search({
        index: element,
        //   type: "_doc",
        scroll: "10s",
        body: {
            query: {
                match_all: {}
            },
        }
    });

    while (hits && hits.hits.length) {

        for (let index = 0; index < hits.hits.length; index++) {
            const element = hits.hits[index];
            new_array.push(element._source)
        }
        console.log(`${new_array.length} of ${hits.total}`);

        var { _scroll_id, hits } = await esClient.scroll({
            scrollId: _scroll_id,
            scroll: "10s"
        });
    }

    mongoDB.connect(url_mongo, options, async (err, client) => {
        const data = await client.db(db)
        if (!err) {
            await data.collection("catalog_new").insertMany(new_array, (err, result) => {
                if (!err) {
                    console.log("Successed insert " + result.ops.length + " data")
                }
                else {
                    console.log(err)
                }
            });
        }
        else {
            console.log("Can't do properly!")
        }
    });

    return new_array;
};

// async function eskibana(element){
//     const body = {
//         query : {
//             match_all : {}
//         }
//     }

//     try {
//         const res = await searchIndex(element, body);
//        for (let index = 0; index < res.hits.hits.length; index++) {
//            const element = res.hits.hits[index];
//            new_array.push(element._source)
//        }
//        fs.writeFileSync(`${element}.json`, JSON.stringify(new_array, 0,2))

//        console.log(new_array);
//     }
//     catch (e) {
//         console.log(e);
//     }
// }

(async () => {


    const job = new cron('*/1 * * * *', async () => {
        for (let index = 0; index < all_index.length; index++) {
            const element = all_index[index];
            await elastic(element);
            console.log("It's Done")
        }

        // client.get(new_array, 'last_state', (err, reply) => {
        //     console.log(reply);
        // });

    })

    job.start();
}
)()