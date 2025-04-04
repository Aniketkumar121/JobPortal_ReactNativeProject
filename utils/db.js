// utils/db.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = '@jobportal_bookmarks';

/**
 * Initialize the database
 */
export const initDB = async () => {
  try {
    const bookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    if (!bookmarks) {
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify([]));
    }
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

/**
 * Save a job bookmark
 * @param {Object} job - The job to bookmark
 */
export const saveBookmark = async (job) => {
  if (!job || !job.id) {
    throw new Error('Invalid job data');
  }

  try {
    const bookmarks = await getBookmarks();
    const isAlreadyBookmarked = bookmarks.some(bookmark => bookmark.id === job.id);
    
    if (isAlreadyBookmarked) {
      return { 
        success: true, 
        message: 'Job already bookmarked',
        isExisting: true 
      };
    }

    const newBookmark = {
      ...job,
      bookmarkedAt: new Date().toISOString()
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    
    return { 
      success: true, 
      message: 'Job bookmarked successfully',
      isExisting: false
    };
  } catch (error) {
    console.error('Error saving bookmark:', error);
    throw new Error('Failed to save bookmark');
  }
};

/**
 * Get all bookmarks
 * @returns {Array} Array of bookmarked jobs
 */
export const getBookmarks = async () => {
  try {
    const bookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

/**
 * Remove a bookmark
 * @param {string|number} jobId - The ID of the job to remove
 */
export const removeBookmark = async (jobId) => {
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  try {
    const bookmarks = await getBookmarks();
    const bookmarkExists = bookmarks.some(bookmark => bookmark.id === jobId);

    if (!bookmarkExists) {
      return {
        success: false,
        message: 'Bookmark not found'
      };
    }

    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== jobId);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    
    return { 
      success: true, 
      message: 'Bookmark removed successfully' 
    };
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw new Error('Failed to remove bookmark');
  }
};

/**
 * Check if a job is bookmarked
 * @param {string|number} jobId - The ID of the job to check
 */
export const isJobBookmarked = async (jobId) => {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some(bookmark => bookmark.id === jobId);
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

/**
 * Clear all bookmarks
 */
export const clearBookmarks = async () => {
  try {
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify([]));
    return {
      success: true,
      message: 'All bookmarks cleared successfully'
    };
  } catch (error) {
    console.error('Error clearing bookmarks:', error);
    throw new Error('Failed to clear bookmarks');
  }
};