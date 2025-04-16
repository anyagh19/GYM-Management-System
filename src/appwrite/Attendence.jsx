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
    async markAttendance(userID, attended) {
        try {
            const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            const existingAttendance = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteAttendenceCollectionID,
                [Query.equal("userID", userID), Query.equal("date", date)]
            );

            if (existingAttendance.documents.length > 0) {
                // Update the attendance if an entry already exists
                const attendanceID = existingAttendance.documents[0].$id;
                await this.database.updateDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteAttendenceCollectionID,
                    attendanceID,
                    { attended }
                );
            } else {
                // Create a new attendance record
                await this.database.createDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteAttendenceCollectionID,
                    ID.unique(),
                    { userID, date, attended }
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
            const res = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteAttendenceCollectionID,
                [Query.equal("userID", userID)]
            );
            return res.documents;
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
}

export const attendanceService = new AttendanceService();
export default attendanceService