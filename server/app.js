require("dotenv").config()
const { client, seedDatabase } = require("./config/database")
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const auth = require("./middleware/auth");
const upload = require("express-fileupload")
const csvtojson = require("csvtojson");
const config = process.env;

const app = express()

app.use(express.json())
app.use(upload());
app.use('/',express.static('public'))

client.connect()
seedDatabase()

app.use(cors({
    origin: 'http://localhost:9000',
    credentials: true
}))

app.get('/auth/me', (req,res) => {
    const token = req.headers.authorization;

    if(!token){
        res.status(401).send("Unauthorized")
    }
    else{
        try {
            const decoded = jwt.verify(token, config.TOKEN_KEY);
            res.status(200).json(decoded)
        } catch (err) {
        return res.status(401).send("Invalid Token");
        }
    }
})

app.post('/auth/login', (req,res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        res.status(400).send("All input is required");
      }

    try{
        client.query(`
            SELECT * FROM users
            WHERE email = ($1) AND password = ($2)`, [email, password])
        .then(result => {
            if(result.rows.length > 0){
                const user = result.rows[0]
                const token = jwt.sign(
                    { user: {user_id : user.id ,admin : user.admin, email}},
                    process.env.TOKEN_KEY,
                    {
                    expiresIn: "2h",
                    }
                );
                res.status(200).json(token)
            }
            else
                res.status(400).send("Invalid name or password")
        });
    } catch (err){
        console.log(err)
    }
})

app.post('/auth/register', async (req,res) => {
    try {
        const { username, email, password, age, height, passwordConfirmation } = req.body;
        if (!(username && email && password && age && height)) {
            res.status(400).send("All input is required");
        }
        await client.query(`
            SELECT * FROM users
            WHERE email = ($1)
        `,[email]).then(result => {
            if(result.rows.length > 0)
                return res.status(409).send("User Already Exist. Please Login");
        })
        if(password === passwordConfirmation)
            client.query(`
                INSERT INTO users (name, email, password, age, height) 
                VALUES ($1, $2, $3, $4, $5)`, [username, email, password, age, height])
                .then( res.status(201).json({message: "Registration succesful!"}))
    }catch (err) {
        console.log(err)
    }
})
app.get('/measurments/get', auth, (req,res) => {
    client.query(`
        SELECT measurments.id, type, date , value, name as method_name, method_id FROM measurments
        LEFT JOIN methods ON methods.id = measurments.method_id
        WHERE user_id = ($1)
        ORDER BY date
    `,[req.user.user_id])
    .then(result => res.status(200).json(result.rows))
})
app.post('/measurments/add', auth, (req,res) => {
    console.log(req.user)
    client.query(`
        INSERT INTO measurments (user_id, method_id, date, value, type)
        VALUES ($1, $2, $3, $4, $5)
    `,[req.user.user_id, req.body.method_id, req.body.date, req.body.value,req.body.type])
    .then(res.status(201).send("Measurments added"))
})
app.post('/measurments/delete', auth, (req, res) => {
    req.body.forEach(id => {
        client.query(`
        DELETE FROM measurments
        WHERE id = ($1)
    `,[id])
    })
    res.status(202).send("Measurment(s) deleted")
})
app.post('/measurments/import', auth, async (req,res) => {
    csvData = Object.values(req.files)[0].data.toString('utf8')
    csvData = await csvtojson().fromString(csvData)
    csvData.forEach(row => {
        if(row.method_id === "")
            row.method_id = null
        if(row.method_name === "")
            row.method_name = null

        client.query(`
            INSERT INTO measurments (user_id, method_id, type, date, value)
            VALUES ($1, $2, $3, $4, $5)
        `,[req.user.user_id,row.method_id,row.type,row.date,row.value])
        .then(res.status(202).send())
    })
})

app.get('/methods/get', auth, (req,res) => {
    client.query(`
        SELECT * FROM methods
    `)
    .then(result => res.status(200).json(result.rows))
})
app.post('/methods/add', auth, (req,res) => {
    client.query(`
        INSERT INTO methods (name, description)
        VALUES ($1, $2)
    `, [req.body.name,req.body.description])
    .then(res.status(201).send("Method added"))
})
app.post('/methods/delete', auth, (req, res) => {
    req.body.forEach(id => {
        console.log(id)
        client.query(`
        DELETE FROM methods
        WHERE id = ($1)
    `,[id])
    })
    res.status(202).send("Method(s) deleted")
})
app.get('/admin/getUsers', auth, (req,res) => {
    if(req.user.admin){
        client.query(`
            SELECT * FROM users
        `)
        .then(result => {
            res.status(200).json(result.rows)
        })
    }
    else
        res.status(401).send("Unauthorized")
})

app.post('/admin/addUser', auth, (req,res) => {
    if(req.body.password === req.body.passwordConfirmation)
        client.query(`
            INSERT INTO users (admin, name, email, age, height, password)
            VALUES ($1, $2, $3, $4, $5, $6)
        `,[req.body.admin,req.body.username,req.body.email,req.body.age,req.body.height, req.body.password])
        .catch(err => res.status(409).send(err.detail))
        .then(() => res.status(201).send(),() => console.log("error"))
})

app.post('/admin/deleteUsers', auth, (req,res) => {
    if(req.user.admin){
        req.body.forEach(id => {
            client.query(`
                DELETE FROM users
                WHERE id = ($1)
            `,[id])
        })
        res.status(202).send()
    }
    else
        res.status(401).send("Unauthorized")
})

app.post('/admin/importUsers', auth, async (req,res) => {
    if(req.user.admin){
        csvData = Object.values(req.files)[0].data.toString('utf8')
        csvData = await csvtojson().fromString(csvData)
        csvData.forEach(row => {
            console.log(row)
            client.query(`
                INSERT INTO users (admin, name, email, age, height, password)
                VALUES ($1, $2, $3, $4, $5, $6)
            `,[row.admin,row.name,row.email,row.age,row.height, row.password])
        })
        res.status(202).send()
    }
    else
        res.status(401).send("Unauthorized")
})

app.get('/admin/getAds', auth, (req,res) => {
    client.query(`
        SELECT * FROM ads
    `).then(result => res.status(200).send(result.rows))
})

app.post('/admin/addAd', auth, (req,res) => {
    console.log(req.body)
    client.query(`
        INSERT INTO ads(image_url,target_url)
        VALUES ($1,$2)
    `,[req.body.image_url,req.body.target_url])
    .then(res.status(200).send())
})

app.post('/admin/deleteAds', auth, (req,res) => {
    if(req.user.admin){
        req.body.forEach(id => {
            client.query(`
                DELETE FROM ads
                WHERE id = ($1)
            `,[id])
        })
        res.status(202).send()
    }
    else
        res.status(401).send("Unauthorized")
})

app.post('/admin/adCount',auth,(req,res) => {
    console.log(req.body)
    if(req.body.length > 0){
        client.query(`
            UPDATE ads
            SET clickcount = clickcount + 1
            WHERE id = ($1)
        `,[req.body])
        .then(res.status(200).send("Ad count incremented"))
    }
})

module.exports = app;