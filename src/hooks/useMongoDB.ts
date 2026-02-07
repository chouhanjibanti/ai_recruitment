import { useState, useEffect } from 'react';
import { mongoDBService } from '../services/mongodbService';

export const useResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await mongoDBService.getAllResumes();
        setResumes(data);
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResumes();
  }, []);
  
  return { resumes, loading };
};

export const useInterviewSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await mongoDBService.getAllInterviewSessions();
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, []);
  
  return { sessions, loading };
};
 

