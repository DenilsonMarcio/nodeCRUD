const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { ResumeToken, ObjectID, ObjectId } = require('mongodb');
const MongoClient = require('mongodb') .MongoClient
const key = '859c80f3-464b-4a3e-82a2-2db504fffc28'
const uri = 'mongodb+srv://livsundev:livsundev@cluster0-ehqwz.mongodb.net/dbTest?retryWrites=true&w=majority'

//Conexão com o MongoDB

MongoClient.connect(uri, (err, client) => {
    
    if (err) return console.log(err)
    db = client.db('dbTest') //nome do banco de dados criado no Mongo

    //faz a comunicação do servidor com o navegador
    app.listen(3000, function(){
        console.log('Server running on port 3000');
    })
})

app.use(bodyParser.urlencoded({ extended: true}))

app.get('/', (req, res) => {
    res.render('index.ejs')
})
//seta o index no servidor para renderizar no navegador
app.get('/', (req, res) => {
    let cursor = db.collection('data').find()
})
//configura a "view engine" no Express
app.set('view engine','ejs');


//Metodo GET - SELECT
app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: result})
    })
})

//Metodo POST - INSERT
app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no banco de dados')
        res.redirect('/show')

    })
})

//Rotas GET e POST - UPDATE
app.route('/edit/:id')

.get((req, res) => {
    var id = req.param.id

    db.collection('data').find(Object(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {data: result})
    })
})

.post((req, res) => {
    var cpf = req.param.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('data').updateOne({id: cpf}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no banco de dados!')
    })
})

//Rotas para EDITAR
/*app.route('/edit/:id')
.get((req, res) => {
    var id = req.param.id;

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result})
    })
})
.post((req, res) => {
    var id = req.param.id;
    var name = req.body.name;
    var surname = req.body.surname;

    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de Dados')
    })
})*/
//Rota para DELETE
app.route('/delete/:id')
.get((req, res) => {
    var cpf = req.param.id

    db.collection('data').deleteOne({id: cpf}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Deletado do Banco de Dados')
        res.redirect('/show')
    })
})
