const path = require('path')
const express = require('express')
const mongoose = require('mongoose')


const PORT = process.env.PORT || 3001
const app = express();

const Update = require('./product')

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dbUser:C3hXUmTfuMVJqTH3@cluster0.v5oll.mongodb.net/Cluseter0?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

mongoose.connect(
    "mongodb+srv://dbUser:C3hXUmTfuMVJqTH3@cluster0.v5oll.mongodb.net/Cluseter0?retryWrites=true&w=majority",

    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);


app.use(express.json());

const d = new Date();

const returnDate = () => {
    var yyyy = d.getFullYear()
    var mm = ('0' + (d.getMonth() + 1)).slice(-2)
    var dd = ('0' + d.getDate()).slice(-2)
    return yyyy + '-' + mm + '-' + dd;
}
app.get("/api", (req, res) => {
    Update.aggregate([{
        $group: {
            _id: null,
            "TotalAmount": {
                $sum: "$name"
            }
        }
    }])
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

app.get('/api/updates', (req, res) => {

    Update.find()
        .sort({ $natural: -1 })
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

app.get('/api/updates/:id', (req, res) => {

    const id = req.params.id;
    Update.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid entry found' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
});

app.get("/api/balance", (req, res) => {

    Update.aggregate([{
        $group: {
            _id: null,
            "total": {
                $sum: "$name"
            }
        }
    }])
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

app.post('/api/updates', (req, res) => {

    const update = new Update({
        _id: new mongoose.Types.ObjectId(),
        date: returnDate(),
        name: req.body.name,
    });
    update
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /products",
                createdProduct: result
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
});

app.delete('/api/updates/:id', (req, res) => {
    const id = req.params.id;
    Update.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

app.patch('/api/updates/:id', (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Update.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})