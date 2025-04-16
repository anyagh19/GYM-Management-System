import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '../../../Index';  // Adjust the path accordingly
import { TrainerService } from '../../appwrite/Trainer'; // Adjust the path accordingly
import authService from '../../appwrite/Auth';
import { Input } from '../../../Index';  // Adjust the path to your Input component
import { Client, ID, Databases, Account, Storage } from "appwrite";
import conf from "../../conf/conf";  // Adjust the path to your conf file
import { useParams } from 'react-router-dom';

const trainerService = new TrainerService();

function TrainerApplicationForm() {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);  // To store the selected profile picture file

    // Appwrite storage initialization for file upload
    const storage = new Storage(new Client().setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectID));
    const { gymId } = useParams()

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);
    
        try {
            const currentUser = await authService.getCurrentUser();
            const trainerID = currentUser.$id;
    
            // STEP 1: Fetch gym document using the doc ID from URL
            const gymDoc = await trainerService.getGym(gymId);  // Assuming gymId is the doc id from useParams
            const originalGymID = gymDoc.gymID;  // Replace `gymID` with whatever field you stored
    
            let profilePic = '';
    
            if (file) {
                const fileUpload = await storage.createFile(conf.appwriteStorageBucketID, ID.unique(), file);
                profilePic = fileUpload.$id;
            }
    
            // STEP 2: Store originalGymID instead of Appwrite's $id
            await trainerService.createTrainerApplication({
                ...data,
                trainerID,
                gymID: originalGymID,  // use original gym ID field
                profilePic,
                price: parseInt(data.price),
                duration: parseInt(data.duration),
            });
    
            toast.success('✅ Trainer application submitted successfully!', { position: 'top-center' });
            reset();
        } catch (err) {
            console.error(err);
            setError('Failed to submit application. Please try again.');
            toast.error('❌ Failed to submit application.', { position: 'top-center' });
        } finally {
            setLoading(false);
        }
    };
    

    // Rest of the form code...


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setValue('profilePic', selectedFile.name);  // Optional: Set the file name in the form if needed
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Trainer Application Form
            </h2>

            {error && <p className="text-red-500 text-center font-medium mb-4">{error}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                {/* Trainer's Name */}
                <Input
                    label="Name"
                    placeholder="Enter your full name"
                    {...register('name', { required: true })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                {/* Trainer's Email */}
                <Input
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    {...register('email', {
                        required: true,
                        pattern: {
                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                            message: 'Invalid email address'
                        }
                    })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                {/* Trainer's Phone */}
                <Input
                    type="text"
                    label="Phone"
                    placeholder="Enter your phone number"
                    {...register('phone', { required: true })}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

                {/* Profile Picture Upload */}
                <div>
                    <label htmlFor="profilePic" className="block text-gray-700 font-medium">
                        Profile Picture
                    </label>
                    <input
                        type="file"
                        id="profilePic"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 p-2 border rounded-md"
                        {...register('profilePic', { required: true })}
                    />
                    {errors.profilePic && <p className="text-red-500 text-sm">{errors.profilePic.message}</p>}
                </div>

                {/* Qualification */}
                <Input
                    label="Qualification"
                    placeholder="Enter your qualification"
                    {...register('qualification', { required: true })}
                />
                {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification.message}</p>}

                {/* Experience */}
                <Input
                    type="number"
                    label="Experience (Years)"
                    placeholder="Enter your years of experience"
                    {...register('experience', { required: 'Experience is required' })}
                />
                {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message}</p>}

                {/* Specialization */}
                <Input
                    label="Specialization"
                    placeholder="Enter your specialization (e.g., Yoga, Personal Training)"
                    {...register('specialization', { required: 'Specialization is required' })}
                />
                {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization.message}</p>}

                <Button
                    type="submit"
                    className="bg-[#007b55] hover:bg-[#005a3c] text-white py-3 rounded-md text-lg font-medium"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
            </form>
        </div>
    );
}

export default TrainerApplicationForm;
