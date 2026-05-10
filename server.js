require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const schoolRoutes = require('./routes/schoolRoutes');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/',schoolRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
