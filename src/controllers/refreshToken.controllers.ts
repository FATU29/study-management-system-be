import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpstatus'
import refreshTokenService from '~/services/refreshToken.services'

export const newAccessTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.decoded_refreshToken
  const newAccessToken = await refreshTokenService.newAccessToken({
    user_id: refreshToken.user_id.toString(),
    role: refreshToken.role,
    verify: refreshToken.verify
  })

  res.status(HTTP_STATUS.OK).json({
    data: {
      access_token: newAccessToken
    }
  })
}
