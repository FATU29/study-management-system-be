import express from 'express'
import { 
    addNotificationValidation,
    deleteNotificationValidation,
    getNotificationValidation, 
    updateNotificationValidation

} from '~/middlewares/notifications.middlewares'

import {
    addNotificationController,
    deleteNotificationController,
    getNotificationController,
    updateNotificationController
} from '~/controllers/notifications.controllers'

const notificationsRouter = express.Router()

notificationsRouter.post('/add', addNotificationValidation, addNotificationController)
notificationsRouter.get('/:userId', getNotificationValidation, getNotificationController)
notificationsRouter.delete('/:id', deleteNotificationValidation, deleteNotificationController)
notificationsRouter.patch('/:id', updateNotificationValidation, updateNotificationController)

export default notificationsRouter