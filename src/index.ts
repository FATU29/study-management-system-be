import express from 'express'
import usersRouter from './routes/users.routes';
import coursesRouter from '~/routes/courses.routes'
import roleRouter from '~/routes/role.routes'
import databaseService from './services/database.services';
import { defaultErrorHandler } from './middlewares/error.middlewares';



const app = express();
const port = 3000;


databaseService.connect().catch(console.dir);
app.use(express.json());


app.use('/users',usersRouter);
app.use('/courses',coursesRouter);
app.use('/role',roleRouter);

app.use(defaultErrorHandler);

app.listen(port,() => {
    console.log(`App is listening on port ${port}`);
})