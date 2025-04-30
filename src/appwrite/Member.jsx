import { Client, ID, Databases, Query } from "appwrite";
import conf from "../conf/conf.js";

class MemberService {
  client = new Client();
  database;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectID);

    this.database = new Databases(this.client);
  }

  async createMember({
    userName,
    userEmail,
    userPassword,
    userPhone,
    userID = ID.unique(),
    userAddress,
    planID,
    title,
    registrationDate,
    expiryDate,
  }) {
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
      console.error("Error creating member: ", error);
      throw error;
    }
  }

  async bookingHistory({
    bookingID = ID.unique(),
    userID,
    planID,
    userName,
    userEmail,
    userPhone,
    userAddress,
    registrationDate,
    expiryDate,
    title,
    price,
  }) {
    try {
      return await this.database.createDocument(
        conf.appwriteDatabaseID,
        conf.appwriteBookingHistoryCollectionID,
        bookingID,
        {
          bookingID,
          userID,
          planID,
          userName,
          userEmail,
          userPhone,
          userAddress,
          registrationDate,
          expiryDate,
          title,
          price,
        }
      );
    } catch (error) {
      console.error("Error creating booking history: ", error);
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
      console.error("Error deleting member: ", error);
      throw error;
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
        userID,
        {
          planID,
          registrationDate,
          expiryDate,
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
      const res = await this.database.listDocuments(
        conf.appwriteDatabaseID,
        conf.appwriteUsersCollectionID,
        [Query.equal("userID", userID)]
      );

      if (res.documents.length === 0) {
        console.error("No document found for the given userID.");
        return null;
      }

      return res.documents[0]; // Return the first document
    } catch (error) {
      console.error("Error fetching member plan: ", error);
      throw error;
    }
  }

  async getMember(docID) {
    try {
      return await this.database.getDocument(
        conf.appwriteDatabaseID,
        conf.appwriteUsersCollectionID,
        docID
      );
    } catch (error) {
      console.error("Error fetching member: ", error);
      throw error;
    }
  }
  
  async getDietPlan(userID) {
    try {
      const res = await this.database.listDocuments(
        conf.appwriteDatabaseID,
        conf.appwriteDietPlanCollectionID,
        [Query.equal("userID", userID)]
      );
  
      if (res.documents.length === 0) {
        throw new Error("No diet plan found for this user.");
      }
  
      return res.documents[0];
    } catch (error) {
      console.error("Error fetching diet plan: ", error);
      throw error;
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
        throw new Error("No diet plan found for this user.");
      }
  
      return res.documents[0];
    } catch (error) {
      console.error("Error fetching diet plan: ", error);
      throw error;
    }
  }
  
}

export const memberService = new MemberService();
export default memberService;
