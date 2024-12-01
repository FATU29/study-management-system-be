import express from 'express'
import { 
    addNotificationValidation,
    deleteNotificationValidation,
    getNotificationValidation, 

} from '~/middlewares/notifications.middlewares'

import {
    addNotificationController,
    deleteNotificationController,
    getNotificationController,
} from '~/controllers/notifications.controllers'

const notificationsRouter = express.Router()

notificationsRouter.post('/add', addNotificationValidation, addNotificationController)
notificationsRouter.get('/:userId', getNotificationValidation, getNotificationController)
notificationsRouter.delete('/:id', deleteNotificationValidation, deleteNotificationController)

export default notificationsRouter