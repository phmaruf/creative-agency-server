const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vdtun.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) =>{
    res.send("Hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const orderCollection = client.db("creativeAgency").collection("order");

  app.post('/order', (req, res) => {
      const order = req.body;
      orderCollection.insertOne(order)
      .then(result => {
          res.send(result.insertedCount)
      })
  })

  app.post('/addService', (req, res)=>{
      const file = req.files.file;
      const name = req.body.name;
      const description = req.body.description;
      console.log(name, description, file);
      file.mv(`${__dirname}/services/${file.name}`, err => {
          if (err){
              console.log(err);
              return res.status(500).send({msg: 'failed to upload image'});
          }
          return res.send({name: file.name, path: `/${file.name}`})
      })
  })
});


app.listen(process.env.PORT || port)  