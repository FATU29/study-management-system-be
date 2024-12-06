import usersService from '~/services/users.services'

class RefreshTokenService {
  async newAccessToken({ user_id, role, verify }: { user_id: string; role?: string; verify?: number }) {
    return await usersService.signAccessToken({ user_id, role, verify })
  }
}

const refreshTokenService = new RefreshTokenService()
export default refreshTokenService