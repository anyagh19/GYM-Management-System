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

    async createAccount({ adminID = ID.unique(), adminEmail, adminPassword, adminName, role , gymName , gymID= ID.unique(), gymAddress, gymDescription, gymImages }) {
        try {
        const userAccount = await this.account.create(adminID , adminEmail , adminPassword , adminName);

        gymDocId= ID.unique()
    
            await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteAdminsCollectionID,
                gymDocId,
                {
                    adminID,
                    adminEmail,
                    adminName,
                    adminPassword,
                    role,
                    gymName,
                    gymID,
                    gymAddress,
                    gymDescription,
                    gymImages
                }
            )
            if (userAccount) {
                await this.login({ email: adminEmail, password: adminPassword })
                localStorage.setItem("gymDocId", gymDocId)
                await this.account.updatePrefs({ role });
                return userAccount;
            }
            else {
                return userAccount;
            }
        } catch (error) {
            console.error("Error creating account: ", error)
            throw error
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
            const user = await this.account.get()
            return user
        } catch (error) {
            console.error("Error getting current user: ", error)
            throw error
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