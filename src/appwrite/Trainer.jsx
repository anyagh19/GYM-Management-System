import { Client , ID, Databases, Account , Query } from "appwrite";
import conf from "../conf/conf.js";

export class TrainerService {
    client = new Client()
    account
    database 

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID)

        this.database = new Databases(this.client)
        this.account = new Account(this.client)
    }

    // async createTrainer({ name,email, password, phone, trainerID = ID.unique(), address, gender , role }){
    //     try {
    //         const res = await this.account.create(trainerID, email, password, name);
    //         await this.database.createDocument(
    //             conf.appwriteDatabaseID,
    //             conf.appwriteTrainersCollectionID,
    //             ID.unique(),
    //             {
    //                 name,
    //                 email,
    //                 password,
    //                 phone,
    //                 trainerID,
    //                 address,
    //                 gender
    //             }
    //         )
    //         if(res){
    //             await this.login({email, password} )
    //             await this.account.updatePrefs({ role });
    //             return res;
    //         }
        
    //         else {
    //         return res;
    //         }
    //     } catch (error) {
    //         console.error("Error creating member: ", error)
    //         throw error
    //     }
    // }

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

    async getTrainerDocIDByUserID(trainerID) {
        try {
            const res = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteTrainersCollectionID,
                [Query.equal("trainerID", trainerID)]
            );
            return res.documents[0]?.$id;
        } catch (error) {
            console.error("Error fetching member doc ID: ", error);
            throw error;
        }
    }

    async createTrainerApplication({
        trainerID = ID.unique(),
        name,
        email,
        phone,
        qualification,
        experience,
        specialization,
        gender,
        password,
        role
      }) {
        try {
          // 1. Create account
          const res = await this.account.create(trainerID, email, password, name);
      
          if (res) {
            // 2. Login immediately
            await this.login({email, password});
      
            // 3. Update prefs
            await this.account.updatePrefs({ role });
      
            // 4. Now safe to create trainer application document
            return await this.database.createDocument(
              conf.appwriteDatabaseID,
              conf.appwriteTrainerApplicationsCollectionID,
              trainerID,
              {
                trainerID,
                name,
                email,
                phone,
                qualification,
                experience,
                specialization,
                gender,
                password,
                role,
              }
            );
          } else {
            throw new Error("Failed to create trainer account");
          }
        } catch (error) {
          console.error("Error creating trainer application: ", error);
          throw error;
        }
      }
      

    async getGym(gymDocID) {
        try {
            return await this.database.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteAdminsCollectionID,  // or your gym collection ID
                gymDocID
            );
        } catch (error) {
            console.error("Error getting gym:", error);
            throw error;
        }
    }
    
    async listAssignedUsers(trainerID) {
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteAssignTrainerCollectionID,
                [Query.equal("trainerID", trainerID)]
            )
        } catch (error) {
            console.error("Error listing assigned users: ", error)
            throw error
        }
    }

    async getUserIDByTrainerID  (trainerID) {
        try {
          // Get document with trainerID field matching input
          const res = await this.database.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteAssignTrainerCollectionID,
            [
            Query.equal('trainerID', trainerID)
          ])
      
          if (res.documents.length === 0) {
            console.warn("❌ No document found with trainerID:", trainerID)
            return null
          }
      
          const doc = res.documents[0] // assuming one-to-one; loop if multiple expected
          return {
            docID: doc.$id,
            userID: doc.userID
          }
        } catch (error) {
          console.error("🔥 Error in getUserIDByTrainerID:", error)
          return null
        }
    }

    

    async getTrainerByUserID(trainerID) {
        try {
          const res = await this.database.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriterGymTrainerCollectionID,
            [
              Query.equal('trainerID', trainerID),
              Query.limit(1),
            ]
          );
      
          if (res.documents.length > 0) {
            return res.documents[0];
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error fetching trainer by userID: ", error);
          throw error;
        }
      }
      

    async setDietPlan({dietID= ID.unique() , userID , trainerID, goal , calories , protein , waterInTake , food , note}){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteDietPlanCollectionID,
                dietID,{
                    dietID,
                    userID,
                    trainerID,
                    goal,
                    calories,
                    protein,
                    waterInTake,
                    food,
                    note
                }
            )
        } catch (error) {
            console.error("Error creating diet plan: ", error)

        }
    }

    async setWorkoutPlan({workoutID= ID.unique() , userID , trainerID, goal , daysPerWeek , plan , note}){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteWorkoutPlanCollectionID,
                workoutID,{
                    workoutID,
                    userID,
                    trainerID,
                    goal,
                    daysPerWeek,
                    plan,
                    note
                }
            )
        } catch (error) {
            console.error("Error creating workout plan: ", error)
        }
    }
}

export const trainerService = new TrainerService();

export default trainerService;
//