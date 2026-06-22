import { Controller, Get } from "@nestjs/common";

@Controller('api/validate-token')
export class AuthController {
  @Get()
  async validateToken(): Promise<{ isAuthenticated: boolean }> { 
    return { isAuthenticated: true }
  }
}