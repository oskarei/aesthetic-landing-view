
import * as Contentstack from 'contentstack';

// Initialize the Contentstack SDK
const Stack = Contentstack.Stack({
  api_key: 'bltaefe95bce3ee136b',
  delivery_token: 'cs07f595d08450634e254ade48', // Replace this with your delivery token
  environment: 'production',
  region: Contentstack.Region.EU
});

// Enable live preview if needed
// Stack.setHost('api.contentstack.io');

// Export the Stack instance for use throughout the application
export default Stack;

// Helper function to fetch entries from a content type
export const getEntries = async (contentType: string, query?: any) => {
  try {
    const Query = Stack.ContentType(contentType).Query();
    
    // Apply additional query parameters if provided
    if (query) {
      if (query.where) {
        Object.entries(query.where).forEach(([key, value]) => {
          Query.where(key, value);
        });
      }
      
      if (query.includeCount) {
        Query.includeCount();
      }
      
      if (query.includeFallback) {
        Query.includeFallback();
      }
      
      if (query.includeReference) {
        query.includeReference.forEach((reference: string) => {
          Query.includeReference(reference);
        });
      }
      
      if (query.limit) {
        Query.limit(query.limit);
      }
      
      if (query.skip) {
        Query.skip(query.skip);
      }
    }
    
    const result = await Query.find();
    return result[0];
  } catch (error) {
    console.error('Error fetching entries from Contentstack:', error);
    throw error;
  }
};

// Helper function to fetch a single entry
export const getEntry = async (contentType: string, entryUid: string) => {
  try {
    const entry = await Stack.ContentType(contentType).Entry(entryUid).fetch();
    return entry;
  } catch (error) {
    console.error('Error fetching entry from Contentstack:', error);
    throw error;
  }
};
