const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteUsersCollectionID: String(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
    appwriteAdminsCollectionID: String(import.meta.env.VITE_APPWRITE_ADMINS_COLLECTION_ID),
    appwriteTrainersCollectionID: String(import.meta.env.VITE_APPWRITE_TRAINERS_COLLECTION_ID),
    appwriteTrainerApplicationsCollectionID: String(import.meta.env.VITE_APPWRITE_TRAINERAPPLICATIONS_COLLECTION_ID),
    appwriteMembershipPlanCollectionID: String(import.meta.env.VITE_APPWRITE_MEMBERSHIPPLAN_COLLECTION_ID),
    appwriteAttendenceCollectionID: String(import.meta.env.VITE_APPWRITE_ATTENDENCE_COLLECTION_ID),
    appwriteAssignTrainerCollectionID: String(import.meta.env.VITE_APPWRITE_ASSIGN_TRAINER_COLLECTION_ID),
    appwriterGymTrainerCollectionID: String(import.meta.env.VITE_APPWRITE_GYM_TRAINER_COLLECTION_ID),
    appwriteDietPlanCollectionID: String(import.meta.env.VITE_APPWRITE_DIET_PLAN_COLLECTION_ID),
    appwriteWorkoutPlanCollectionID: String(import.meta.env.VITE_APPWRITE_WORKOUT_PLAN_COLLECTION_ID),
    appwriteTrainerRatingCollectionID: String(import.meta.env.VITE_APPWRITE_TRAINER_RATING_COLLECTION_ID),
    appwriteGymRatingCollectionID: String(import.meta.env.VITE_APPWRITE_GYM_RATING_COLLECTION_ID),
    appwriteBookingHistoryCollectionID: String(import.meta.env.VITE_APPWRITE_BOOKING_HISTORY_COLLECTION_ID),
} // 

export  default conf;