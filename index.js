const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// MongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins
    credentials: true
}));
app.use(express.json());

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@hajj.zsqpd.mongodb.net/?retryWrites=true&w=majority&appName=Hajj`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusternariaalllanding.tzrtn.mongodb.net/?retryWrites=true&w=majority&appName=ClusterNariaAllLanding`

// Create a MongoClient
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const BookingCollection = client.db('landingPage').collection('booking');
        const NewsCollection = client.db('landingPage').collection('news');
        const VideoCollection = client.db('landingPage').collection('video');
        const CardCollection = client.db('landingPage').collection('card');

        // GET routes
        app.get('/booking', async (req, res) => {
            try {
                const result = await BookingCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        app.get('/news', async (req, res) => {
            try {
                const result = await NewsCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        app.get('/video', async (req, res) => {
            try {
                const result = await VideoCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        // POST routes
        app.post('/booking', async (req, res) => {
            try {
                const bookingData = req.body;
                const result = await BookingCollection.insertOne(bookingData);
                res.status(201).send(result);
            } catch (error) {
                console.error("Error adding Booking:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        app.post('/news', async (req, res) => {
            try {
                const bookingData = req.body;
                const result = await NewsCollection.insertOne(bookingData);
                res.status(201).send(result);
            } catch (error) {
                console.error("Error adding Booking:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        app.post('/video', async (req, res) => {
            try {
                const videoData = req.body;
                const result = await VideoCollection.insertOne(videoData);

                if (result.acknowledged) {
                    res.status(201).send({ insertedId: result.insertedId });
                } else {
                    res.status(400).send({ error: 'Failed to add video' });
                }
            } catch (error) {
                console.error("Error adding video:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        // DELETE routes
        app.delete('/video/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await VideoCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        app.delete('/news/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await NewsCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        app.delete('/booking/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await BookingCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        // GET all cards
        app.get('/card', async (req, res) => {
            try {
                const result = await CardCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error('Error fetching cards:', error);
                res.status(500).send("Internal Server Error");
            }
        });

        // POST a new card
        app.post('/card', async (req, res) => {
            try {
                const { title, header, subHeader, description, imageUrl } = req.body;
                const newCard = {
                    title, header, subHeader, description, imageUrl
                };
                const result = await CardCollection.insertOne(newCard);

                if (result.insertedId) {
                    res.status(201).send({ _id: result.insertedId, ...newCard });
                } else {
                    res.status(400).send({ error: "Failed to add card" });
                }
            } catch (error) {
                console.error("Error adding card:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        // DELETE a card
        app.delete('/card/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await CardCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Do not close the client to keep the server running
    }
}

run().catch(console.dir);

// Root Route
app.get('/', (req, res) => {
    res.send('Project landing running');
});

// Start Server
app.listen(port, () => {
    console.log(`Project landing is running on port ${port}`);
});
