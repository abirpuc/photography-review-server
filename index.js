
const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json());

require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k6rknfb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serverCollection = client.db('PhotographyReview').collection('services')

        app.get('/services', async(req,res) =>{
            const query = {}
            const cursor = serverCollection.find()
            const service = await cursor.toArray()
            res.send(service)
        })
    }
    finally{

    }
}

run().catch(err =>console.log(err))


app.get('/', (req, res) => {
    res.send('Review server is running!!')
})

app.listen(port, (req, res) => {
    console.log(`Review server is running on ${port}`);
})
