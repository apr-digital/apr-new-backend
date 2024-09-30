
const express = require('express');

//const batchRoutes=require('./src/routes/batch.routes');

const app = express();
const port = process.env.PORT || 4003;
const bodyParser = require("body-parser");
const cors = require("cors");
const req = require('express/lib/request');

const adminRouter = require("./src/routes/adminlogin.route")

const adminConfigRouter = require("./src/routes/adminconfiguration.route");
const corpRouter = require("./src/routes/corporate.route");
const reportRoutes = require("./src/routes/reports.route");
const dashboardRoutes = require("./src/routes/dashboard.route");
const websiteRoutes = require("./src/routes/website.route");
const reminderRoutes = require("./src/routes/reminder.route");
const communicationRoutes = require("./src/routes/communication.route")


//used to post data in json (middleware)
app.use(express.json());

process.env.TZ = "Asia/Calcutta";
// var corsOptions = {
//   origin: "http://localhost:8081"
// };

app.use(cors());


//CORS-HEADERS- Required for cross origin and cross server communication
app.use((req, res, next) => {
    res.setHeader('Access-Control_Allow-Origin', '*');
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
    res.send("Hai Welcome To Our APR-MARATHON APP Admin_Portal services from jenkins with stage changes in production!");
});

app.use("/api/admin", adminRouter)

app.use("/api/admin/config", adminConfigRouter)

app.use("/api/admin/corporate", corpRouter);
app.use("/api/admin/report", reportRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/website", websiteRoutes);
app.use("/api/reminder", reminderRoutes);
app.use("/api/admin/communication", communicationRoutes)




app.listen(port, () => console.log(`app listening to ${port}`));

