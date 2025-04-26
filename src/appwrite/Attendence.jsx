import { Client, ID, Databases, Query } from "appwrite";
import conf from "../conf/conf.js";

class AttendanceService {
    client = new Client();
    database;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectID);

        this.database = new Databases(this.client);
    }

    // Add or update attendance for today
    async markAttendance(userID, attended, role , name) {
        try {
            const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            const existingAttendance = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteAttendenceCollectionID,

                [Query.equal("userID", userID), Query.equal("date", date)]
            );

            // Inside markAttendance
            if (existingAttendance.documents.length > 0) {
                const attendanceID = existingAttendance.documents[0].$id;
                await this.database.updateDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteAttendenceCollectionID,
                    attendanceID,
                    { attended, role  , name}  // <-- include role here too if you want admin to update it
                );
            } else {
                await this.database.createDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteAttendenceCollectionID,
                    ID.unique(),
                    { userID, date, attended, role , name}  // <-- new record will have role
                );
            }

        } catch (error) {
            console.error("Error marking attendance: ", error);
            throw error;
        }
    }

    // Get attendance history for a user
    async getAttendanceHistory(userID) {
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteAttendenceCollectionID,
                [Query.equal("userID", userID)]
            );
            
        } catch (error) {
            console.error("Error fetching attendance history: ", error);
            throw error;
        }
    }

    async listAttendance(userID) {
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteAttendenceCollectionID,
                [Query.equal("userID", userID)]
            )
        } catch (error) {
            console.error("Error listing attendance: ", error);
            throw error;
        }
    }

    // AttendanceService.js
    async getAllAttendance() {
        try {
            const res = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteAttendenceCollectionID
            );
            return res.documents;
        } catch (error) {
            console.error("Error fetching all attendance: ", error);
            throw error;
        }
    }

}

export const attendanceService = new AttendanceService();
export default attendanceService