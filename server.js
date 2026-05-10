require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const schoolRoutes = require('./routes/schoolRoutes');
app.use(bodyParser.json());
app.use(cors());

app.use('/',schoolRoutes);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
