import { Client , ID , Databases, Query } from "appwrite";
import conf from "../conf/conf.js";

export class MemberService {
    client = new Client()
    database 

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID)

        this.database = new Databases(this.client)
    }

    async createMember({ userName, userEmail,userPassword,  userPhone,  userID= ID.unique(), userAddress ,planID, title, registrationDate , expiryDate  }){
        try {
            const res = await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                userID,
                {
                    userName,
                    userEmail,
                    userPassword,
                    userPhone,
                    userAddress,
                    registrationDate,
                    expiryDate,
                    userID,
                    planID,
                    title, 
                   
                }
            );
            return res;
        } catch (error) {
            console.error("Error creating member: ", error)
            throw error
        }
    }

    async bookingHistory({ bookingID = ID.unique() , userID ,  gymID , planID , userName , userEmail , userPhone , userAddress , registrationDate , expiryDate , title , price }){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteBookingHistoryCollectionID,
                bookingID,
                {
                    bookingID,
                    userID,
                    
                    gymID,
                    planID,
                    userName,
                    userEmail,
                    userPhone,
                    userAddress,
                    registrationDate,
                    expiryDate,
                    title,
                    price
                }
            )
        } catch (error) {
            console.error("Error creating booking history: ", error)
        }
    }
    async deleteMember(userID) {
        try {
            return await this.database.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                userID
            );
        } catch (error) {
            console.error("Error deleting member: ", error)
            throw error
        }
    }

    async getMember(userID) {
        try {
            return await this.database.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                userID
            )
        
        } catch (error) {
            console.error("Error fetching member: ", error)
        }
    }
    async getMemberDocIDByUserID(userID) {
        try {
            const res = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                [Query.equal("userID", userID)]
            );
            return res.documents[0]?.$id;
        } catch (error) {
            console.error("Error fetching member doc ID: ", error);
            throw error;
        }
    }

    async updateMemberPlan(userID, planID, durationInDays) {
        try {
          const registrationDate = new Date().toISOString();
          const expiryDate = new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000).toISOString();
      
          const res = await this.database.updateDocument(
            conf.appwriteDatabaseID,
            conf.appwriteUsersCollectionID,
            userID, // assuming you use the auth ID or the document ID stored on login
            {
              planID,
              registrationDate,
              expiryDate
            }
          );
      
          return res;
        } catch (error) {
          console.error("❌ Error updating member plan:", error);
          throw error;
        }
      }
      
      async getMemberPlan(userID) {
        try {
            // Fetch documents based on the "userID" field using listDocuments
            const res = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                [Query.equal("userID", userID)] // Use Query to search for the userID
            );
            
            if (res.documents.length === 0) {
                console.error("No document found for the given userID.");
                return null;
            }
    
            // Assuming you want to return the first document from the result
            return res.documents[0]; 
        } catch (error) {
            console.error("Error fetching member plan: ", error);
            throw error;
        }
    }
    
    async getDietPlan(userID) {
        try {
            const res =  await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteDietPlanCollectionID,
                [Query.equal("userID", userID)]
            )

            if (res.documents.length === 0) {
                console.error("No workout plan found for this user.");
                return null;
              }
          
              return res.documents[0];
        } catch (error) {
            console.error("Error fetching diet plan: ", error)
            throw error
        }
    }

    async getWorkoutPlan(userID) {
        try {
          const res = await this.database.listDocuments(
            conf.appwriteDatabaseID,
            conf.appwriteWorkoutPlanCollectionID,
            [Query.equal("userID", userID)]
          );
      
          if (res.documents.length === 0) {
            console.error("No workout plan found for this user.");
            return null;
          }
      
          return res.documents[0]; // Return the first matching document
        } catch (error) {
          console.error("Error fetching workout plan: ", error);
          throw error;
        }
      }

      async rateTrainer({trainerRateID = ID.unique() , trainerID , userID , rating , feedback , name}){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteTrainerRatingCollectionID,
                trainerRateID,
                {
                    trainerRateID,
                    trainerID , 
                    userID,
                    rating,
                    feedback, 
                    name
                }
            )
        } catch (error) {
            console.log('create trainer rating error' , error)
        }
      }
      
      async getTrainerRating({trainerID , userID}){
        try {
            const res =  await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteTrainerRatingCollectionID,
                [
                    Query.equal('trainerID' , trainerID),
                    Query.equal('userID' , userID)
                ]
            )

            if(res.documents.length === 0) {
                console.error("No trainer rating found for this user.");
                return null;
              }
            else{
                return await this.database.deleteDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteTrainerRatingCollectionID,
                    res.documents[0].$id
                )
            }
        } catch (error) {
            console.log('get trainer rating error' , error)
        }
      }
      async rateGym({gymRateID = ID.unique() , gymID , userID , rating , feedback, name}){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteGymRatingCollectionID,
                gymRateID,
                {
                    gymRateID,
                    gymID , 
                    userID,
                    rating,
                    feedback,
                    name
                }
            )
        } catch (error) {
            console.log('create gym rating error' , error)

        }
      }

      async getGymRating({gymID , userID}){
        try {
            const res =  await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteGymRatingCollectionID,
                [
                    Query.equal('gymID' , gymID),
                    Query.equal('userID' , userID)
                ]
            )

            if(res.documents.length === 0) {
                console.error("No gym rating found for this user.");
                return null;
              }
              else{
                return await this.database.deleteDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteGymRatingCollectionID,
                    res.documents[0].$id
                )
            }
        } catch (error) {
            console.log('get gym rating error' , error)
        }
      }

      async getGymIDFromUserID(userID) {
        try {
            const res = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                [Query.equal("userID", userID)]
            )

            if (res.documents.length === 0) {
                console.error("No document found for the given userID.");
                return null;
            }

            const doc = res.documents[0] // assuming one-to-one; loop if multiple expected
              return {
                docID: doc.$id,
                gymID: doc.gymID
              }
        } catch (error) {
            console.error("Error fetching gym ID: ", error);
            throw error;
        }
      }
}

export const memberService = new MemberService()

export default memberService