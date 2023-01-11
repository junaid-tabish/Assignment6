const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('./middlewares/sessionMiddleware');
const router = require('./routes/route');
//.env to hide the confedential data
require('dotenv').config();
const pizzaSchema = require('./models/PizzaDetail');
const PORT = process.env.PORT;
//Mongo DB Connection
const MONGODB_URI = process.env.DB_URI;
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const app = express();
//static data connection
app.use(express.static('static'));
app.use("/static", express.static("static"));


mongoose.set('strictQuery', false);

app.engine('handlebars', exphbs.engine({
    helpers: {
        // Function to do basic mathematical operation in handlebar
        math: function (lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        }
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    style: "header.css"
}));
//setting up handlebars engine
app.set('view engine', 'handlebars');
//setting up views 
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session);

//creat connection
mongoose.connect(MONGODB_URI)
    .then(res => { console.log(`DB CONNECTED`); })
    .catch(err => { console.log(err.message); });

app.use('/', router)

//page not found
app.use("*", (req, res) => {
    res.status(404).render("404")
});

//running server 
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`listening on port :${PORT}`);
});