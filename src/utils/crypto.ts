import bcryptjs from "bcryptjs"



const numberSalt = Number(process.env.NUMBERTOSALT);


export const hashBcrypt = async (password:string): Promise<string> => {
    return (await bcryptjs.hash(password,numberSalt));
}


export const compareBcrypt = async (password:string,hash:string): Promise<boolean> => {
    return await bcryptjs.compare(password,hash)
}