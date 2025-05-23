import { Client, ID , Databases, Role, Query } from "appwrite";
import conf from "../conf/conf.js";

export class AdminService {
    client = new Client()
    database 

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID)

        this.database = new Databases(this.client)
    }

    async createPlan({ title, description, price, duration , planID= ID.unique() }){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteMembershipPlanCollectionID,
                planID,
                {
                    title,
                    description,
                    price: parseInt(price),
                    duration,
                    planID,
                   
                },
                // [
                //     Permissions.read([Role.any()]),
                //     Permissions.write([Role.any()]),
                //     Permissions.update([Role.any()]),
                //     Permissions.delete([Role.any()]),
                // ]
            )
        } catch (error) {
            console.error("Error creating plan: ", error)
            throw error
        }
    }

    async deletePlan(planID) {
        try {
            return await this.database.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteMembershipPlanCollectionID,
                planID
            )
        } catch (error) {
            console.error("Error deleting plan: ", error)
            throw error
        }
    }

    async listPlans() {
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteMembershipPlanCollectionID,
                
            )
        } catch (error) {
            console.error("Error listing plans: ", error)
            throw error
        }
    }

    async getPlan(planID) {
        try {
            return await this.database.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteMembershipPlanCollectionID,
                planID
            )
        } catch (error) {
            console.error("Error getting plan: ", error)
            throw error
        }
    }

    async registeredUser(){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID
            )
        } catch (error) {
            console.error("Error registering user: ", error)
            throw error
        }
    }

    async listGyms(){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteAdminsCollectionID
            )
        } catch (error) {
            console.error("Error listing gyms: ", error)
            throw error
        }
    }

    async getGym(gymID) {
        try {
            return await this.database.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteAdminsCollectionID,
                gymID
            )
            console.log("Gym details: ", gymID)
        } catch (error) {
            console.error("Error getting gym: ", error)
            throw error
        }
    }

    async listTrainerApplication(){
        try {
            return this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteTrainerApplicationsCollectionID,
               
            )
        } catch (error) {
            console.log('listing appli eroo' , error)
            throw error
        }
    }

    async deleteTrainerApplication(trainerID) {
        try {
            return await this.database.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteTrainerApplicationsCollectionID,
                trainerID
            )
        } catch (error) {
            console.error("Error deleting trainer application: ", error)
            throw error
        }
    }

    async createGymTrainer({ trainerID, name, email, phone, qualification , specialization , experience }){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriterGymTrainerCollectionID,
                ID.unique(),
                {
                    
                    
                    trainerID,
                    name,
                    email,
                    phone,
                    qualification,
                    specialization,
                    experience
                },
            )
        } catch (error) {
            console.error("Error creating gym trainer: ", error)
        }
    }

    async listGymTrainers() {
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriterGymTrainerCollectionID,
                
            )
        } catch (error) {
            console.error("Error listing gym trainers: ", error)
            throw error
        }
    }

    async deleteTrainer(documentId){
        try {
            return this.database.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriterGymTrainerCollectionID,
                documentId
            );
        } catch (error) {
            console.error("Error deleting trainer: ", error);
            throw error;
        }
    }
    
    async assignTrainerToMember({ assignID = ID.unique(),userID, trainerID, }) {
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteAssignTrainerCollectionID, // Define this in your conf.js
                assignID,
                {
                    assignID,
                  
                    userID,
                    trainerID,
                    
                }
            );
        } catch (error) {
            console.error("Error assigning trainer to member:", error);
            throw error;
        }
    }

    async deleteAssignTrainer(userID){
        try {
            return this.database.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteAssignTrainerCollectionID,
                [
                    Query.equal('userID', userID)
                ]
            )
        } catch (error) {
            console.log(error)
        }
    }
    
    async bookinHistoryOfGym() {
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteBookingHistoryCollectionID,
               
            )
        } catch (error) {
            console.error("Error listing booking history: ", error)
        }
    }

    async listAllPlan(){
        try {
            return this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteMembershipPlanCollectionID
            )
        } catch (error) {
            console.log(error)
        }
    }

    async listFeedTrainer(){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteTrainerRatingCollectionID,
            )
        } catch (error) {
            console.log(error)
        }
    }

    async listFeedGym(){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteGymRatingCollectionID
            )
        } catch (error) {
            console.log(error)
        }
    }

    async listTrainers(){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriterGymTrainerCollectionID,
            )
        } catch (error) {
            console.log(error)
        }
    }
}

export const adminService = new AdminService()

export default adminService