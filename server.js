require('dotenv').config(); // This loads the environment variables from .env file
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());


const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.REACT_APP_DB_USERNAME,
  password: process.env.REACT_APP_DB_PASSWORD,
  database: 'contact_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const populateInitialData = async () => {
  try {
    // Check if the initial contacts already exist
    const [existingContacts] = await pool.query('SELECT * FROM contacts LIMIT 1');//Optimise word we do not want to return multiple just to
    //if one exists

    if (existingContacts.length === 0) {
      // Initial contacts data
      const initialContacts = [
        { name: 'Nahid', email: 'nahid@example.com', phone_number: '0738485239', address: 'Anything Road' },
        { name: 'Matt Smith', email: 'mat@example.com', phone_number: '07452738492', address: 'Highgarden' },
        { name: 'ZhangFei', email: 'zhangfei@example.com', phone_number: '0113938475', address: 'ABC road' },
        { name: 'Abbey', email: 'Abby@example.com', phone_number: '02938483940', address: 'ZOO garden' },
      ];

      // Insert the initial contacts into the database
      for (const contact of initialContacts) {
        await pool.query(
          'INSERT INTO contacts (name, email, phone_number, address) VALUES (?, ?, ?, ?)',
          [contact.name, contact.email, contact.phone_number, contact.address]
        );
      }

      console.log('Initial contacts added to the database.');
    } else {
      console.log('Initial contacts already exist in the database.');
    }
  } catch (error) {
    console.error('Error populating initial data:', error);
  }
};

populateInitialData();

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const contactId = req.params.id;

    // Check if the contact with the given ID exists
    const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [contactId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Perform the deletion in the database
    await pool.query('DELETE FROM contacts WHERE id = ?', [contactId]);

    res.status(204).send(); // Responds with a success status and no content
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/contacts', async (req, res) => {
    const{search, filter}=req.query;
  let sql = 'SELECT * FROM contacts'; //Builds block for SQL query
  if(search){
    sql+= ` WHERE ${filter} LIKE "${search}%"`
  }

    try { 
      const [rows] = await pool.query(sql);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/contacts/:id', async (req, res) => {
    try {
      const contactId = req.params.id;
  
      // Fetch the contact details from the database
      const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [contactId]);
  
      // Check if a contact with the given ID exists
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }
  
      const contact = rows[0];
      res.json(contact);
    } catch (error) {
      console.error('Error fetching contact details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //route for updating a contact
app.put('/api/contacts/:id', async (req, res) => {
    try {
      const { name, email, phone_number, address } = req.body;
      const contactId = req.params.id;
  
      // TODO: Validate input data if needed
  
      // Update the contact in the database
      await pool.query(
        'UPDATE contacts SET name=?, email=?, phone_number=?, address=? WHERE id=?',
        [name, email, phone_number, address, contactId]
      );
  
      res.status(200).json({ message: 'Contact updated successfully' });
    } catch (error) {
      console.error('Error updating contact:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // POST route to add a new contact
  app.post('/api/contacts', async (req, res) => {
    try {
      const { name, email, phone_number, address } = req.body;
  
      // TODO: Validate input data
  
      // Insert the new contact into the database
      const result = await pool.query(
        'INSERT INTO contacts (name, email, phone_number, address) VALUES (?, ?, ?, ?)',
        [name, email, phone_number, address]
      );
  
      // Respond with the inserted contact data
      res.status(201).json({ id: result.insertId, name, email, phone_number, address });
    } catch (error) {
      console.error('Error adding contact:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });