import { User } from '../models/User';
export class CacheHandler {

    private static SECRET = 'cache-handler-secret';
    /* --------------------- Main handler getter and setter --------------------- */
    public static store(key: string, obj: any) {
        let data = '{}';
        try { data = JSON.stringify(obj); } catch (err) { }
        localStorage.setItem(key, data);
    }
    public static get(key: any): any {
        try {
            return JSON.parse(<string>localStorage.getItem(key), <any>CacheHandler.SECRET);
        } catch (err) {
            return null;
        }
    }
    /* -------------------------------------------------------------------------- */

    /* ------------------------- Storing login response ------------------------- */
    public static storeLoginData(obj: any) {
        CacheHandler.store('___d', obj);
    }
    public static removeLoginData() {
        localStorage.removeItem('___d');
    }

    public static storeUserLater(user: User) {
        let token = CacheHandler.getStoredToken();
        CacheHandler.storeLoginData({ token: token, user });
    }

    /* ----------------------------- Get cached user ---------------------------- */

    public static getStoredUser(): User | null {
        try { return CacheHandler.get('___d').user } catch (err) { return null; }
    }

    /* ---------------------------- Get stored token ---------------------------- */
    public static getStoredToken() {
        try { return CacheHandler.get('___d').token } catch (err) { return null; }
    }

}