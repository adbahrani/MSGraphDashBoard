import { graphConfig } from "../authConfig";

export class UsersService {
  public static async getAll(token: string) {
    const { value } = await fetch(graphConfig.usersEndGuest, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => response.json());

    return value;
  }
}
