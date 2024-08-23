require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3009
const URI = process.env.URI

mongoose.connect(URI).then(elem => console.log("only okay to connect to db"))
.catch(err => console.log("error connecting to db"))


const autherSchema = new mongoose.Schema({
    autorName : String,
    autorBirthday:Date,
    autorNacanality : {
        type : String,
        enum : ["Anglia", "American"]
    }
})

const bookSchema = new mongoose.Schema({
    title : String,
    publicationYear:Number,
    pages : Number,
    author_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Autors'
    }
    
})
const book = mongoose.model("Bookssss", bookSchema); 
const authore = mongoose.model('Autors', autherSchema);

app.post('/books', async (req, res) => {

 const {title, publicationYear, pages, autho } =req.body

autho._id = new mongoose.Types.ObjectId()
const author = new authore(autho)
const savedAuthor = await author.save()

 const Boock = {
     _id : new mongoose.Types.ObjectId(),
     title,
     pages,
     publicationYear,
     author_id : savedAuthor._id
    }


    const books = new book(Boock)
    await books.save()
    res.send("ok")
})

app.get('/books', async (req, res) => {
    const query = req.query.q
    const nameQuery = query.split("-").join(" ")
    
    const books = await book.find({title:nameQuery}).populate('author_id')
    res.send({messege:books})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})