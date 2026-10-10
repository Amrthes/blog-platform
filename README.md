Commands for your friend
1. Open the cloned project folder
cd blog-platform


2. Install the dependencies
npm install


3. Create a .env file
In the project root, create a file named .env with the following:
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_own_secret_key
PORT=5000


- She should use her own MongoDB connection string, or one from a database she has permission to access.
- If she uses your Atlas database, you must authorize her access through MongoDB Atlas. Never share your database password publicly.
4. Start the backend
npm start


If your package.json doesn't define a start script, try:
node index.js


5. Test the API
If the server starts successfully, she can open Postman and test:
- POST http://localhost:5000/auth/register
- POST http://localhost:5000/auth/login
- GET http://localhost:5000/blog/getAll
For registration and login, select Body → raw → JSON in Postman.
