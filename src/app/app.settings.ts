import { environment } from "src/environments/environment";

export class Appsettings {

    public static get API_ENDPOINT(): string {
        return environment.apiUrl;
    }
}