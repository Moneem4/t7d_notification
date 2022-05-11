require('dotenv').config();
const express = require('express');
const connectDB = require('./config/connect_db');
const connectFirebase = require('./config/connectFirebase');
const cors = require('cors');
const notificationRoute = require('./routes/notificationRoute');
const app = express();
app.use(express.json());
app.use(cors());
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
const morgan = require('morgan');
const ecsFormat = require("@elastic/ecs-morgan-format");
const PORT = process.env.PORT || 3000;
app.use(morgan(ecsFormat('tiny')));
connectDB();
connectFirebase();
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
app.use("/notification", notificationRoute);
// handler for 500
app.use((res) => {
  res.status(500).send('Connection Error!')
})
