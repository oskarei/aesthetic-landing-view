
import React, { useEffect, useState } from 'react';
import { getEntries } from '@/utils/contentstackClient';

interface ContentData {
  title?: string;
  description?: string;
  [key: string]: any;
}

const ContentstackExample = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ContentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'content_type_uid' with your actual content type UID
        const response = await getEntries('content_type_uid', {
          limit: 1,
        });
        
        if (response && response.entries && response.entries.length > 0) {
          setData(response.entries[0]);
        } else {
          setError('No content found');
        }
      } catch (err) {
        setError('Failed to fetch content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4 text-white/70">Loading content...</div>;
  if (error) return <div className="p-4 text-white/70">Error: {error}</div>;
  if (!data) return <div className="p-4 text-white/70">No content available</div>;

  return (
    <div className="p-4 bg-black/30 backdrop-blur-sm rounded-lg text-white">
      <h3 className="text-xl font-medium mb-2">{data.title || 'Content from Contentstack'}</h3>
      <p className="text-white/70">{data.description || 'Content description would appear here'}</p>
      {/* Render other fields as needed */}
    </div>
  );
};

export default ContentstackExample;
