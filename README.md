# Calendar Reminder App

## Project Overview
The Calendar Reminder App is a web application built with Node.js and Express that allows users to add, delete, and view reminders for specific dates. The application features a simple and user-friendly interface.

### Features
- **Add Reminders**: Users can easily add reminders for any date.
- **Delete Reminders**: Users can remove reminders as needed.
- **Current Day Highlighted**: The application highlights the current day for better visibility.
- **Add more than one reminder a day**: You can also add more reminders in the same day.
- **See a weather icon on the reminders using the openweathermap api**

### Incomplete Features
The following functionalities are not yet implemented:
7. The user may edit a reminder's information. 
9. You may allow the user to change the current month.

## Running the Project Locally

To run this project on your local machine, follow these steps:

1. **Clone the Repository**:
   Open your terminal and run the following command to clone the repository:
   ```
   git clone https://github.com/Cauzadaa/Sva_calendar.git

    Navigate to the Project Directory



Install Dependencies:
--node.js
--cd<root_projeto>

__you need: npm i__
 
And run the server:
**node server.js**
Make sure you're in the root of the project folder.

Step 4: Access the Application
Once the server is running, open your web browser and go to:

http://localhost:3000
Project Structure:
/server: Contains the backend files such as server.js, which handles API routes and file serving.
/public: Contains front-end assets like index.html, script.js, and style.css.
/reminders.json: Stores the reminders data.
API Endpoints
GET /api/reminders - Fetches all reminders.
POST /api/reminders - Adds a new reminder.
DELETE /api/reminders/:id - Deletes a reminder by ID.




