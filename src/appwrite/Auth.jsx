import { Client, Account, ID, Databases } from "appwrite";
import conf from "../conf/conf.js";

export class AuthService {
    client = new Client()
    account
    database

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID)

        this.account = new Account(this.client)
        this.database = new Databases(this.client)
    }

    async createAccount(payload) {
        try {
            const role = payload.role || 'member';
            let userAccount;
            let userID = ID.unique();
            let docID = ID.unique();
    
            if (role === 'admin') {
                const {
                    adminEmail,
                    adminPassword,
                    adminName,
                    gymName,
                    gymAddress,
                    gymDescription,
                    gymImages = ''
                } = payload;
    
                userAccount = await this.account.create(userID, adminEmail, adminPassword, adminName);
    
                await this.database.createDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteAdminsCollectionID,
                    docID,
                    {
                        adminID: userID,
                        adminEmail,
                        adminName,
                        adminPassword,
                        role,
                        gymName,
                        gymID: ID.unique(),
                        gymAddress,
                        gymDescription,
                        gymImages
                    }
                );
    
                await this.login({ email: adminEmail, password: adminPassword });
            }
    
            else if (role === 'member') {
                const {
                    email,
                    password,
                    name,
                    phone,
                    address
                } = payload;
    
                userAccount = await this.account.create(userID, email, password, name);
    
                
    
                await this.login({ email, password });
            }
    
            await this.account.updatePrefs({ role });
            return userAccount;
        } catch (error) {
            console.error("Error creating account: ", error);
            throw error;
        }
    }
    

    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            if (!session) throw new Error("Login failed. No session created.");
            console.log("Login successful:", session);
            return session;
        } catch (error) {
            console.error("Error logging in: ", error)
            throw error
        }
    }

    async getCurrentUser() {
        try {
          const user = await this.account.get();
          return {
            id: user.$id,
            name: user.name,
            email: user.email,
            role: user.prefs?.role || 'member',
            ...user
          };
        } catch (error) {
          console.error("Error getting current user: ", error);
          throw error;
        }
      }
      

    async logOut() {
        try {
            const currentUser = await this.getCurrentUser();
            if (!currentUser) return; // User already logged out

            await this.account.deleteSession('current');
            localStorage.removeItem("gymDocId")
            return true
        } catch (error) {
            console.error("Error logging out: ", error)
            throw error
        }
    }
}

const authService = new AuthService()

export default authService;