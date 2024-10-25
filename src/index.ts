import express from 'express'
import usersRouter from './routes/users.routes';
import databaseService from './services/database.services';
import { defaultErrorHandler } from './middlewares/error.middlewares';



const app = express();
const port = 3000;


databaseService.connect().catch(console.dir);
app.use(express.json());
app.use('/users',usersRouter);

app.use(defaultErrorHandler as any);




app.listen(port,() => {
    console.log(`App is listening on port ${port}`);
})