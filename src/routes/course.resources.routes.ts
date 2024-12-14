import express from 'express'
import { getAllCourseResourceController } from '~/controllers/course.resources.controllers'
import { simpleControlWrapper } from '~/utils/handler'

const resourceRouter = express.Router({ mergeParams: true })

resourceRouter.get('/', simpleControlWrapper(getAllCourseResourceController))

resourceRouter.post('/add', (req, res) => {
  res.send('Add resource')
})

export default resourceRouter
