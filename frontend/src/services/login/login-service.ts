import { HttpService, httpService } from "../http/http-service";
import { UserDto } from "@/services/dto/user-dto";

export class LoginService {
  private url = "login";

  constructor(private http: HttpService) {}

  request(email: string, password: string): Promise<LoginResponseDto> {
    return this.http.post(this.url, {
      email,
      password
    });
  }
}

export const loginService = new LoginService(httpService);

export interface LoginResponseDto {
  user: UserDto;
  jwt: string;
}
