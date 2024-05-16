
require('dotenv').config();
const express = require('express');
const mongoose = ('mongoose');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');

const app = express();

const connect = require('./backend/connect');

connect();

//TypeError: Cannot destructure property 'name' of 'req.body' as it is undefined.precisa confg JSON
app.use(express.json());

const User = require('./models/User');

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo ao Conteúdo de API'})
}
);
// private Router
app.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id

    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({ msg:' usuário não encontrado' })
    }

    res.status(200).json({ user })
});

function checkToken(req, res, next) {
    const authHead = req.headers['authorization']
    const token = authHead && authHead.split(' ')[1]

    if(!token) {
        return req.status(401).json({ msg:'Acesso negado!'})
    }

    try {
        const secret = process.env.SECRET
        
        jwt.verify(token, secret)

       next()
    } catch (error) {
        res.status(400).json({ msg: "Token inválido" })
    }
}

// Register User
app.post('/auth/register', async(req, res) => {
    
    const {name, email, password, confirmpassword} = req.body

    // validations
    if(!name) {
        return res.status(422).json({ msg: 'o nome é obrigatório!'});
    }

    if(!email) {
        return res.status(422).json({ msg: 'o email é obrigatório!'});
    }

    if(!password) {
        return res.status(422).json({ msg: 'a senha é obrigatória!'});
    }
//check if user exists
if(password !== confirmpassword) {
    return res.status(422).json({ msg: 'as senhas não conferem!'});
}

const userExists = await User.findOne({ email: email});

if(userExists) {
    return res.status(422).json({ msg: 'por favor, utilize outro e-mail!'});

}

//create password
const salt = await bcrypt.genSalt(12)
const passwordHash = await bcrypt.hash(password, salt)

//create user// criar parametros que ira para o banco
const user = new User({
    name,
    email,
    password: passwordHash,
})

try {
    await user.save(
        res.status(201).json({ msg: 'Usuário criado com sucesso'})
    )
    
} catch (error) {
    console.log(error)

    res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!'})
    
}
});
// login user
app.post('/auth/login', async(req, res) => {

    const { email, password } = req.body

    if(!email) {
        return res.status(422).json({ msg: 'o email é obg!'})
    }

    if(!password) {
        return res.status(422).json({ msg: 'password é obg!'})
    }

    //check if user exists
const user = await User.findOne({ email: email})
if(!user){
    return res.status(402).json({msg: 'Usuário não encontrado!'})
}

//check if password match
const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(422).json({ msg: 'senha invalida' })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
        {
            id: user._id,
        },
        secret,
        )
        res.status(200).json({ msg:'Autenticação realizada com sucesso', token })     
    } catch (err) {
        console.log(error)
    res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' })
    }

});


app.listen(3000);
    console.log('API RODANDO ');
