const mysql = require('mysql');
const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');
const app = express();
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Your SMTP host
  port: 587, // Your SMTP port
  secure: false, // Set to true if your SMTP server requires a secure connection (SSL/TLS)
  auth: {
    user: 'maria.boumonsif11@gmail.com', // Your email address
    pass: 'jsgvehlhvlytakum' // Your email password
  }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/images', express.static(__dirname + '/public/images'));
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'markets'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Retrieve products from the database
    connection.query('SELECT * FROM products', (error, results) => {
      if (error) {
        res.writeHead(500);
        res.end('Error retrieving products from the database');
      } else {
        fs.readFile('index.html', 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            // Replace a placeholder in the HTML template with the products
            const productsHtml = generateProductsHtml(results);
            const updatedHtml = data.replace('{{products}}', productsHtml);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(updatedHtml);
          }
        });
      }
    });
  } else if (req.url === '/register') {
    if (req.method === 'POST') {
      let body = '';

      req.on('data', (data) => {
        body += data;
      });

      req.on('end', () => {
        const formData = parseFormData(body);
        registerUser(formData, (error) => {
          if (error) {
            res.writeHead(500);
            res.end('Error registering user');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('Registration successful!');
          }
        });
      });
    } else {
      fs.readFile('register.html', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading register.html');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    }
  } else if (req.url === '/login') {
    if (req.method === 'POST') {
      let body = '';
  
      req.on('data', (data) => {
        body += data;
      });
  
      req.on('end', () => {
        const formData = parseFormData(body);
        loginUser(formData, (error, user) => {
          if (error) {
            res.writeHead(500);
            res.end('Error logging in');
          } else if (!user) {
            res.writeHead(401);
            res.end('Invalid username or password');
          } else {
            res.writeHead(302, { 'Location': '/' });
            res.end();
          }
        });
      });
    } else {
      fs.readFile('login.html', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading login.html');
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data);
        }
      });
    }
  ``
  } else if (req.url === '/dashboard') {
    fs.readFile('dashboard.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading dashboard.html');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else if (req.url === '/dashboard/profile') {
    fs.readFile('profile.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading profile.html');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else if (req.url === '/contact') {
    if (req.method === 'POST') {
      let body = '';
  
      req.on('data', (data) => {
        body += data;
      });
  
      req.on('end', () => {
        const formData = parseFormData(body);
  
        // Send the email
        sendEmail(formData, (error) => {
          if (error) {
            res.writeHead(500);
            res.end('Error sending email');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('Email sent successfully!');
          }
        });
      });
    } else {
      fs.readFile('contact.html', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading contact.html');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    }
  
  } else if (req.url === '/about') {

    fs.readFile('about.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading about.html');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else if (req.url === '/table') {
    // Retrieve employees from the database
    connection.query('SELECT * FROM employees', (error, results) => {
      if (error) {
        res.writeHead(500);
        res.end('Error retrieving employees from the database');
      } else {
        fs.readFile('table.html', 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading table.html');
          } else {
            // Generate the HTML for the employees table
            const employeesHtml = generateEmployeesHtml(results);
            const updatedHtml = data.replace('{{employees}}', employeesHtml);
  
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(updatedHtml);
          }
        });
      }
    });
    
  } else if (req.url === '/style.css') {
    fs.readFile('style.css', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading style.css');
      } else {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

function parseFormData(body) {
  const formData = {};
  const formPairs = body.split('&');

  for (let pair of formPairs) {
    const [key, value] = pair.split('=');
    formData[key] = decodeURIComponent(value);
  }

  return formData;
}

function registerUser(formData, callback) {
  const { username, name, Phone, Email, password } = formData;
  const query = `INSERT INTO users (username, name, Phone, Email, password) VALUES (?, ?, ?, ?, ?)`;
  const values = [username, name, Phone, Email, password];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error registering user:', error);
      callback(error);
    } else {
      console.log('User registered successfully');
      callback(null);
    }
  });
}
function generateProductsHtml(products) {
  let html = '';

  for (const product of products) {
    html += `
      <div>
        <h3>${product.ProductsName}</h3>
        <img src="/images/${product.ProductsImage}" alt="${product.ProductsName}">

        <p>Price: ${product.ProductsPrice}</p>
      </div>
    `;
  }

  return html;
}



function loginUser(formData, callback) {
  const { username, password } = formData;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const values = [username, password];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error logging in:', error);
      callback(error, null);
    } else if (results.length === 0) {
      callback(null, null); // User not found
    } else {
      const user = results[0];
      console.log('User logged in:', user.username);
      callback(null, user);
    }
  });
}

function generateEmployeesHtml(employees) {
  let html = '';

  for (const employee of employees) {
    html += `
      <tr>
        <td><img class="rounded-circle mr-2" width="30" height="30" src="assets/img/avatars/avatar1.jpeg">${employee.name}</td>
        <td>${employee.employeeid}</td>
        <td>${employee.employeename}</td>
        <td>${employee.employeeemail}</td>
        <td>${employee.employeeaddress}</td>
       
      </tr>
    `;
  }

  return html;
}


function sendEmail(formData, callback) {
  const { name, email, message } = formData;

  // Create the email message
  const mailOptions = {
    from: 'maria.boumonsif11@gmail.com', // Sender email address
    to: 'maria.boumonsif11@gmail.com', // Recipient email address
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      callback(error);
    } else {
      console.log('Email sent successfully:', info.response);
      callback(null);
    }
  });
}






