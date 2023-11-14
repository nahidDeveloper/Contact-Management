# Contact-Management
A Fullstack application using React and Node.js
This is only the backend of the Application will need to be used with the client.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MySQL database


### Database Setup

1. **Create Database:**
   - Open your MySQL command line or any MySQL client tool.
   - Execute the following SQL command to create a database:

     ```sql
     CREATE DATABASE contacts_app;
     ```

2. **Switch to the Database:**
   - Use the following command to switch to the newly created database:

     ```sql
     USE contacts_app;
     ```

3. **Create Contacts Table:**
   - Execute the following SQL command to create the `contacts` table:

     ```sql
     CREATE TABLE contacts (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       phone_number VARCHAR(20) NOT NULL,
       address VARCHAR(255),
     );
### Installation

1. Clone the repository:
    git clone https://github.com/nahidDeveloper/contact-Management.git
2. Install dependencies:
   ```npm install```
3. Set up SQL Database, remove the .example ending to the .env file and replace with database credentials
4. Start application
   ```npm start```


### Improvements
- There are a few improvments that can be made for this application
- Another sort filter and use the ORDER BY sorting for the API.
- Add parameter queries for better sanitation
- Add further sanition to avoid SQL injections
- Add Pagination to handle large amounts of entries and thus display by added on the front end.
- Split up Server code as right now is all in one file
- Better documentation
- Add authentication and add users such that users could only add update and delete entries.


 
   

