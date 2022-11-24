
const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json());

require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k6rknfb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('PhotographyReview').collection('services');
        const reviewCollection = client.db('PhotographyReview').collection('reviews');

        app.get('/services', async(req,res) =>{
            const query = {}
            const cursor = serviceCollection.find()
            const service = await cursor.toArray()
            res.send(service)
        })

        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        app.get('/review',async(req,res)=>{
            // console.log(req.query.userEmail)
            let query = {}
            if(req.query.userEmail){
                query = {
                    userEmail : req.query.userEmail
                }
            }
            const result = await reviewCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/review/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id:ObjectId(id) }
            const result = await reviewCollection.findOne(query)
            res.send(result)
        })

        app.patch('/review/:id', async(req,res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const review = req.body;
            const option = {upsert:true};
            const updatedReviewData = {
                $set:{
                    userName: review.userName,
                    userEmail: review.userEmail,
                    mobile: review.mobile,
                    serviceName: review.serviceName,
                    message: review.message
                }
            }
            const result = await reviewCollection.updateOne(filter,updatedReviewData,option);
            res.send(result)
        })


        app.post('/services', async(req,res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.send(service)
        })


        app.post('/review', async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })


        app.delete('/review/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
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
