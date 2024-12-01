import {Request, Response} from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Notification, INotification } from '~/models/schemas/notification.schema';
import { ObjectId } from 'mongodb';
import notificationServices from '../services/notifications.services';
import { NotificationRequest } from './request/notification.request';
import HTTP_STATUS from '~/constants/httpstatus';

export const addNotificationController = async (
    req: Request<ParamsDictionary, any, INotification>,
    res: Response
) => {
    const _id = new ObjectId();
    const title = req.body.title;
    const content = req.body.content;
    const userId = req.body.userId;
    const isRead = req.body.isRead;

    const objectNotification = new Notification({
        _id,
        title,
        content,
        userId,
        isRead,
    })

    const result = await notificationServices.createNotification(objectNotification);

    res.json({
        message:"Create notification Successfully",
        status:HTTP_STATUS.OK,
        data:{
        ...result
        }
    })
}

export const getNotificationController = async (
    req: Request<ParamsDictionary, any, NotificationRequest>,
    res: Response
) => {
    const userId = req.params.userId;
    const result = await notificationServices.getNotification(userId);

    if(result){
        res.json({
        message:"Get Notification Successfully",
        status:HTTP_STATUS.OK,
        data:{
            notifications: result
        }
    })
    } else {
        res.json({
            message:"Notification not found",
            status:HTTP_STATUS.NOT_FOUND,
            data:{
                notification: result
            }
        })
    }
}

export const deleteNotificationController = async (
    req: Request<ParamsDictionary, any, NotificationRequest>,
    res: Response
) => {
    const userId = new ObjectId(req.params.userId);
    const result = await notificationServices.deleteNotification(userId);

    if(result){
        res.json({
        message:"Delete Notification Successfully",
        status:HTTP_STATUS.OK,
        data:{
            notification: result
        }
    })
    } else {
        res.json({
            message:"Notification not found",
            status:HTTP_STATUS.NOT_FOUND,
            data:{
                notification: result
            }
        })
    }
}