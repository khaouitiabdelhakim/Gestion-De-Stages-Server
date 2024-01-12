# Internship Management Web App - Backend

![alt text](https://github.com/khaouitiabdelhakim/Gestion-De-Stages-Client/blob/main/stage.png)

This is the backend server for the Internship Management Web App, responsible for handling data storage, authentication, and communication with the frontend.

## Technologies Used

- **Node.js:** A JavaScript runtime for server-side development.
- **Express.js:** A web application framework for Node.js.
- **PostgreSQL:** A powerful, open-source relational database.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- PostgreSQL database installed and running.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/khaouitiabdelhakim/Gestion-De-Stages-Server.git
   cd Gestion-De-Stages-Server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database and update the configuration in `.env` file.

4. Start the server:

   ```bash
   npm start
   ```

   The server will be running at [http://localhost:3001](http://localhost:3001).

## Configuration

- Update the `.env` file with your database connection details and any other configuration parameters.
   ```plaintext
     DB_USER=your_username
     DB_HOST=localhost
     DB_DATABASE=your_database_name
     DB_PASSWORD=your_password
     DB_PORT=5432
     ```

## License
This project is licensed under the MIT License 

```
Copyright 2024 KHAOUITI ABDELHAKIM, BENGMAH AnassEL, ARGOUBI El Mehdi

Licensed under the MIT License
You may obtain a copy of the License at

http://opensource.org/licenses/MIT

Unless required by applicable law or agreed to in writing, software
distributed under the MIT License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the MIT License.
```

## Acknowledgments

- Special thanks to the Node.js, Express.js, and PostgreSQL communities for their excellent tools and support.

