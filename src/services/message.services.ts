import { ObjectId } from "mongodb";
import databaseService from "./database.services";

class MessageService{

    async getMessages(userId:ObjectId,receiverId:ObjectId, page:number = 1, perPage:number = 6){
        const data = await databaseService.messages.find({
            $or:[
                {
                    senderId: userId,
                    receiverId: receiverId
                },
                {
                    senderId: receiverId,
                    receiverId: userId
                }
            ]
        })
        .sort({ createdAt: -1 })
        .skip((page - 1)* perPage)
        .limit(perPage)
        .toArray()

        return data;
    }


}


const messageService = new MessageService();
export default messageService;