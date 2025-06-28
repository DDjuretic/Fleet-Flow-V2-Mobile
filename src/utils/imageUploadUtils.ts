import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { Platform } from 'react-native';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

/**
 * Fix URL for Android emulator - replace localhost with 10.0.2.2
 * @param url - Original URL from Supabase
 * @returns Fixed URL that works with Android emulator
 */
const fixUrlForAndroidEmulator = (url: string): string => {
  if (Platform.OS === 'android' && __DEV__ && url.includes('localhost')) {
    // For Android emulator in development, use 10.0.2.2 instead of localhost
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
};

/**
 * Get a signed URL for receipt image that works better with Android emulator
 * @param filePath - Path to the file in storage
 * @returns Signed URL that should work with Android emulator
 */
export const getReceiptImageUrl = async (filePath: string): Promise<string | null> => {
  try {
    // First try to get signed URL (works better with Android emulator)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('expense-receipts')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (!signedError && signedData?.signedUrl) {
      const fixedUrl = fixUrlForAndroidEmulator(signedData.signedUrl);
      console.log('✅ Using signed URL:', fixedUrl);
      return fixedUrl;
    }

    // Fallback to public URL
    const { data: publicData } = supabase.storage
      .from('expense-receipts')
      .getPublicUrl(filePath);

    if (publicData?.publicUrl) {
      const fixedUrl = fixUrlForAndroidEmulator(publicData.publicUrl);
      console.log('⚠️ Fallback to public URL:', fixedUrl);
      return fixedUrl;
    }

    return null;
  } catch (error) {
    console.error('❌ Error getting receipt URL:', error);
    return null;
  }
};

/**
 * Upload receipt image to Supabase Storage
 * @param imageUri - Local image URI from ImagePicker
 * @param expenseId - ID of the expense this receipt belongs to
 * @param userId - ID of the user uploading the image
 * @returns Promise with upload result
 */
export const uploadReceiptImage = async (
  imageUri: string, 
  expenseId: string, 
  userId: string
): Promise<UploadResult> => {
  try {
    console.log('📸 Starting receipt upload for expense:', expenseId);
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = imageUri.split('.').pop() || 'jpg';
    const fileName = `receipt_${expenseId}_${timestamp}.${fileExtension}`;
    const filePath = `${userId}/${fileName}`;
    
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Convert base64 to ArrayBuffer
    const arrayBuffer = decode(base64);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('expense-receipts')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExtension}`,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('expense-receipts')
      .getPublicUrl(filePath);

    const fixedUrl = fixUrlForAndroidEmulator(urlData.publicUrl);
    console.log('✅ Receipt uploaded successfully:', fixedUrl);
    
    return {
      success: true,
      url: fixedUrl,
      path: filePath
    };

  } catch (error: any) {
    console.error('❌ Upload failed:', error);
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
};

/**
 * Delete receipt image from Supabase Storage
 * @param filePath - Path of the file to delete
 * @returns Promise with deletion result
 */
export const deleteReceiptImage = async (filePath: string): Promise<boolean> => {
  try {
    console.log('🗑️ Deleting receipt:', filePath);
    
    const { error } = await supabase.storage
      .from('expense-receipts')
      .remove([filePath]);

    if (error) {
      console.error('❌ Delete error:', error);
      return false;
    }

    console.log('✅ Receipt deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Delete failed:', error);
    return false;
  }
};

/**
 * Get receipt images for an expense
 * @param expenseId - ID of the expense
 * @returns Promise with list of receipt URLs
 */
export const getReceiptImages = async (expenseId: string): Promise<string[]> => {
  try {
    // This would typically query the expense_receipts table
    // For now, we'll implement a simple approach
    console.log('📋 Getting receipts for expense:', expenseId);
    
    // In a real implementation, you'd query the expense_receipts table
    // and return the file URLs from there
    return [];
  } catch (error) {
    console.error('❌ Failed to get receipts:', error);
    return [];
  }
};

/**
 * Create expense receipt record in database
 * @param expenseId - ID of the expense
 * @param fileUrl - URL of the uploaded file
 * @param fileName - Original file name
 * @param userId - ID of the user who uploaded
 * @returns Promise with creation result
 */
export const createExpenseReceiptRecord = async (
  expenseId: string,
  fileUrl: string,
  fileName: string,
  userId: string,
  filePath: string
): Promise<boolean> => {
  try {
    console.log('💾 Creating expense receipt record');
    
    const { error } = await supabase
      .from('expense_receipts')
      .insert({
        expense_id: expenseId,
        file_url: fileUrl,
        file_name: fileName,
        uploaded_by_user_id: userId,
        mime_type: 'image/jpeg', // Could be dynamic based on file type
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Failed to create receipt record:', error);
      return false;
    }

    console.log('✅ Receipt record created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create receipt record:', error);
    return false;
  }
};

export default {
  uploadReceiptImage,
  deleteReceiptImage,
  getReceiptImages,
  createExpenseReceiptRecord,
  getReceiptImageUrl
}; 