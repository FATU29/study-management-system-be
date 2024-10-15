import express from 'express'
import usersRouter from './routes/users.routes';
import databaseService from './services/database.services';



const app = express();
const port = 3000;


databaseService.connect().catch(console.dir);
app.use(express.json());
app.use('/users',usersRouter);



app.listen(port,() => {
    console.log(`App is listening on port ${port}`);
})