## Project Start 
Before you run the project, please ensure a `.env` file exists in the root directory. 

Example `.env`
```bash
PORT=3001
MONGO_URI=mongodb://localhost:27017/clothing-store 
JWT_SECRET=yoursecret` 
``` 

Start the server 
```bash 
$ yarn run start:dev
``` 

The Git commit history reflects the steps I worked and the time taken to complete the project.

## Key Points
- Used MVC and DTO to structure the backend
- JWT authentication with @nestjs/passport
- toJSON() to custom and avoid not necessary field from mongo
- Better to have refresh token logic

Also, A Postman collection (postman.json) is included for your convenience, feel free to use it to test the API.

I am looking forward to your comments and feedback!