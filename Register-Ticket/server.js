
const express = require('express');

//const batchRoutes=require('./src/routes/batch.routes');

const app = express();
const port = process.env.PORT || 4002;
const bodyParser = require("body-parser");
const cors = require("cors");
const req = require('express/lib/request');

//import registration routes
const registrationRoutes = require("./src/routes/registration.route")
const corpRegRoutes = require("./src/routes/corpregistration.route")
const paymentRoutes = require("./src/routes/payment.route");
const newRegRoutes = require("./src/routes/new.registration.routes");
//used to post data in json (middleware)
app.use(express.json());

process.env.TZ = "Asia/Calcutta";
// var corsOptions = {
//   origin: "http://localhost:8081"
// };

app.use(cors());


//CORS-HEADERS- Required for cross origin and cross server communication
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization');

    res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS');
    next();
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
// define a root route
app.get("/", (req, res) => {
    res.send("Hai Welcome To Our APR-MARATHON APP Register-Ticket-Services!");
});

//app.use('/api/batch',batchRoutes);

app.use("/api/registration", registrationRoutes);
app.use("/api/corporate", corpRegRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/new/registration", newRegRoutes)

app.listen(port, () => console.log(`app listening to ${port}`));

