const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
var mysql = require('mysql');
require('dotenv').config();
const app = express();
app.use(cors());
const PORT = process.env.PORT;
app.use(bodyParser.json());
// API endpoint to handle form submissions
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/submit', (req, res) => {
    console.log(req.body);
    const { name, age,phone, batch, price, todayDate } = req.body;
    // Age validation logic 
    if (age < 18 || age > 65){ 
      res.json({ message: "Age should be in range 18 to 65" });
      return ;
    }
    const query = "INSERT INTO user(phone,name,age) values(?,?,?)";
    const values = [phone,name,age];
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error executing insert query:', err);
        return res.status(500).json({ message: 'Error inserting user into database' });
      }
      console.log('User inserted:', results);
    });
    connection.query("INSERT INTO enrollment(user_id ,batch_id,amount_paid,payment_date) values(?,?,?,STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'))", [phone,batch,price,todayDate], (err, results) => {
      if (err) {
        console.error('Error executing insert query:', err);
        return res.status(500).json({ message: 'Error inserting user into database' });
      }
      console.log('User inserted:', results);
    });
    // Mock payment function
    const userData = {
        name,age,batch,
    }
    const paymentDetail = {
        price,todayDate
    }
    const paymentResponse = CompletePayment(userData,paymentDetail);
    res.json({ success: paymentResponse.status === 'success', message: paymentResponse.message });
});

// Mock function for payment
function CompletePayment(user,paymentDetail) {
    console.log('Processing payment for user:', user.name ,' on ',paymentDetail.todayDate);
    return { status: 'success', message: 'Payment completed successfully' };
}
process.on('SIGINT', () => {
  connection.end();
  process.exit();
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
