import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

// Types
export interface ImagePickerResult {
  success: boolean;
  imageUri?: string;
  error?: string;
}

export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

// Constants
const PROFILE_IMAGES_BUCKET = 'avatars';
const LOCAL_PROFILE_IMAGE_KEY = 'profile_image_';

// Request camera and media library permissions
export const requestImagePermissions = async (): Promise<boolean> => {
  try {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted';
  } catch (error) {
    console.error('Error requesting image permissions:', error);
    return false;
  }
};

// Take photo with camera
export const takePhotoWithCamera = async (): Promise<ImagePickerResult> => {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permission.status !== 'granted') {
      return {
        success: false,
        error: 'Camera permission required'
      };
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    });

    if (result.canceled) {
      return {
        success: false,
        error: 'Camera cancelled'
      };
    }

    return {
      success: true,
      imageUri: result.assets[0].uri
    };
  } catch (error) {
    console.error('Error taking photo:', error);
    return {
      success: false,
      error: 'Failed to take photo'
    };
  }
};

// Pick image from gallery
export const pickImageFromGallery = async (): Promise<ImagePickerResult> => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permission.status !== 'granted') {
      return {
        success: false,
        error: 'Media library permission required'
      };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    });

    if (result.canceled) {
      return {
        success: false,
        error: 'Image picker cancelled'
      };
    }

    return {
      success: true,
      imageUri: result.assets[0].uri
    };
  } catch (error) {
    console.error('Error picking image:', error);
    return {
      success: false,
      error: 'Failed to pick image'
    };
  }
};

// Upload image to Supabase Storage - NEW & SIMPLIFIED VERSION
export const uploadImageToSupabase = async (
  imageUri: string,
  bucketName: string,
  userId: string
): Promise<{ publicUrl: string | null; error: any }> => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileExtension = imageUri.split('.').pop()?.toLowerCase() || 'jpeg';
    const contentType = `image/${fileExtension}`;
    const fileName = `${userId}/${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, decode(fileContent), {
        contentType,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return { publicUrl: urlData.publicUrl, error: null };

  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    return { publicUrl: null, error };
  }
};

// Save image to the local file system for caching
export const saveImageLocally = async (imageUri: string): Promise<string | null> => {
  try {
    const fileName = imageUri.split('/').pop();
    if (!fileName) return null;
    
    const localUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.copyAsync({
      from: imageUri,
      to: localUri,
    });
    return localUri;
  } catch (error) {
    console.error('Error saving image locally:', error);
    return null;
  }
};

// Get locally cached image URI
export const getLocalImage = async (imageUri: string): Promise<string | null> => {
  try {
    const fileName = imageUri.split('/').pop();
    if (!fileName) return null;
    
    const localUri = `${FileSystem.cacheDirectory}${fileName}`;
    const fileInfo = await FileSystem.getInfoAsync(localUri);

    return fileInfo.exists ? localUri : null;
  } catch (error) {
    console.error('Error getting local image:', error);
    return null;
  }
};

// Remove locally cached image
export const removeLocalImage = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${LOCAL_PROFILE_IMAGE_KEY}${userId}`);
  } catch (error) {
    console.error('Error removing local image:', error);
  }
};

// Delete old image from Supabase Storage
export const deleteImageFromSupabase = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract filename from URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .remove([fileName]);

    if (error) {
      console.error('Error deleting image from Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

/**
 * Upload receipt image to Supabase Storage.
 * This version reads the file as base64 and uploads it as a blob,
 * which is a robust method for React Native.
 */
export const uploadReceiptToSupabase = async (imageUri: string, expenseId: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
    const fileName = `receipt_${expenseId}_${Date.now()}.jpg`;
    const filePath = `${fileName}`;
    const contentType = 'image/jpeg';

    console.log(`Uploading ${fileName} to expense-receipts bucket.`);

    const { data, error } = await supabase.storage
      .from('expense-receipts')
      .upload(filePath, decode(base64), { contentType });

    if (error) {
      console.error("Error during Supabase upload:", error);
      throw error;
    }

    console.log('Upload successful, retrieving public URL...');
    const { data: urlData } = supabase.storage.from('expense-receipts').getPublicUrl(data.path);
    
    console.log('Successfully uploaded receipt, URL:', urlData.publicUrl);
    return urlData.publicUrl;

  } catch (e) {
    console.error("An unexpected error occurred in uploadReceiptToSupabase:", e);
    // Re-throw the error to be caught by the calling function
    throw e;
  }
};

/**
 * Deletes a receipt image from Supabase Storage.
 * The path should be the file name inside the bucket, e.g., 'receipt_xyz.jpg'
 */
export const deleteReceiptFromSupabase = async (filePath: string) => {
  try {
    console.log(`Attempting to delete from Supabase Storage: expense-receipts/${filePath}`);
    const { data, error } = await supabase.storage
      .from('expense-receipts')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting receipt from Supabase:', error);
      throw error;
    }
    
    console.log('Successfully deleted receipt from Supabase:', data);
    return data;
  } catch (e) {
    console.error('An unexpected error occurred in deleteReceiptFromSupabase:', e);
    throw e;
  }
}; 