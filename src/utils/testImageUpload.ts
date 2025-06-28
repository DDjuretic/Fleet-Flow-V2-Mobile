import { uploadReceiptImage, createExpenseReceiptRecord } from './imageUploadUtils';

/**
 * Test function to verify image upload works
 * This can be called from console or debug screens
 */
export const testImageUpload = async () => {
  console.log('🧪 Starting image upload test...');
  
  // Mock data for testing
  const testImageUri = 'https://via.placeholder.com/300x200.png?text=Test+Receipt';
  const testExpenseId = 'test-expense-123';
  const testUserId = 'test-user-456';
  
  try {
    // Test upload
    const uploadResult = await uploadReceiptImage(
      testImageUri,
      testExpenseId,
      testUserId
    );
    
    console.log('📤 Upload result:', uploadResult);
    
    if (uploadResult.success && uploadResult.url) {
      // Test database record creation
      const recordResult = await createExpenseReceiptRecord(
        testExpenseId,
        uploadResult.url,
        'test_receipt.png',
        testUserId,
        uploadResult.path || ''
      );
      
      console.log('💾 Database record result:', recordResult);
      
      if (recordResult) {
        console.log('✅ Image upload test PASSED!');
        return true;
      } else {
        console.log('❌ Database record creation FAILED');
        return false;
      }
    } else {
      console.log('❌ Image upload FAILED:', uploadResult.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Image upload test ERROR:', error);
    return false;
  }
};

/**
 * Quick test to check Storage bucket access
 */
export const testStorageAccess = async () => {
  console.log('🔍 Testing Storage bucket access...');
  
  try {
    const { supabase } = await import('../lib/supabase');
    
    // Try to list files in expense-receipts bucket
    const { data, error } = await supabase.storage
      .from('expense-receipts')
      .list('', {
        limit: 1
      });
    
    if (error) {
      console.error('❌ Storage access error:', error);
      return false;
    }
    
    console.log('✅ Storage access OK. Files found:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Storage access test failed:', error);
    return false;
  }
};

export default {
  testImageUpload,
  testStorageAccess
}; 