'use client';

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { initializeFirebase } from './index';

// Initialize Firebase services
const { firebaseApp } = initializeFirebase();
const storage = getStorage(firebaseApp);

/**
 * Uploads an image file to Firebase Storage.
 * @param file The image file to upload.
 * @param path The path in storage to upload the file to (e.g., 'galleryItems').
 * @returns A promise that resolves with the public download URL of the uploaded image.
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const storageRef = ref(storage, `${path}/${fileName}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};


/**
 * Deletes an image from Firebase Storage using its public URL.
 * @param imageUrl The public URL of the image to delete.
 * @returns A promise that resolves when the image is deleted.
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
    } catch (error: any) {
        // It's common to try to delete a file that doesn't exist (e.g., if a previous delete failed).
        // We can safely ignore "object-not-found" errors.
        if (error.code === 'storage/object-not-found') {
            console.warn(`Attempted to delete image that does not exist: ${imageUrl}`);
            return;
        }
        console.error("Error deleting image from storage:", error);
        throw error; // Re-throw other errors
    }
};
