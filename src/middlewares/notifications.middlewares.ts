import { checkSchema } from "express-validator";    
import { ErrorWithStatus } from "~/models/Errors";
import HTTP_STATUS from "~/constants/httpstatus";
import { createSlug } from "~/utils/slugify";
import databaseService from "~/services/database.services";
import { ObjectId } from "mongodb";

export const addNotificationValidation = checkSchema({
    title: {
        custom: {
        options: async (value, { req }) => {
            const title = value.trim();
    
            if (value === "") {
            throw new ErrorWithStatus({
                message: "Title not empty",
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            });
            }
            const slug = createSlug(title);
    
            try {
            const notification = await databaseService.notifications.findOne({
                slug: slug,
            });
            if (notification) {
                throw new ErrorWithStatus({
                message: "Notification has existed",
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                });
            }
    
            req.slugOfNotification = slug;
            return true;
            } catch (error: any) {
            throw error;
            }
        },
        },
    },
    content: {
        notEmpty: true,
    },
    userId: {
        notEmpty: true,
    },
    isRead: {
        notEmpty: true,
    },
});

export const deleteNotificationValidation = checkSchema({
    notificationId: {
        custom: {
        options: async (value, { req }) => {
            try {
            const notification = await databaseService.notifications.findOne({
                _id: new ObjectId(value),
            });
            if (!notification) {
                throw new ErrorWithStatus({
                message: "Notification not found",
                status: HTTP_STATUS.NOT_FOUND,
                });
            }
            req.notification = notification;
            return true;
            } catch (error: any) {
            throw error;
            }
        },
        },
    },
});

export const getNotificationValidation = checkSchema({
    notificationId: {
        custom: {
        options: async (value, { req }) => {
            try {
            const notification = await databaseService.notifications.findOne({
                _id: value,
            });
            if (!notification) {
                throw new ErrorWithStatus({
                message: "Notification not found",
                status: HTTP_STATUS.NOT_FOUND,
                });
            }
            req.notification = notification;
            return true;
            } catch (error: any) {
            throw error;
            }
        },
        },
    },
});