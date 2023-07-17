import { graphConfig } from "../authConfig";

export class TokenService {
  private static token = "";
  private static expirationDate = new Date();

  public static async getToken() {
    if (!this.isTokenValid()) {
      this.token = await fetch(graphConfig.token, {
        method: "GET",
      }).then((response) => response.text());
      this.expirationDate = new Date();
      this.expirationDate.setTime(
        this.expirationDate.getTime() + 60 * 60 * 1000
      );
    }

    return this.token;
  }

  private static isTokenValid() {
    return (
      this.token && this.expirationDate.getTime() > Date.now() + 5 * 60 * 1000
    );
  }
}
