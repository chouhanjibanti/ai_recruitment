import { useState, useEffect } from 'react';
import { mongoDBService } from '../services/mongodbService';
 
export const useResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError(null);
        await mongoDBService.connect();
        const data = await mongoDBService.getAllResumes();
        setResumes(data);
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
        setError('Failed to fetch resumes');
      } finally {
        setLoading(false);
      }
    };
 
    fetchResumes();
  }, []);
 
  const refreshResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mongoDBService.getAllResumes();
      setResumes(data);
    } catch (error) {
      console.error('Failed to refresh resumes:', error);
      setError('Failed to refresh resumes');
    } finally {
      setLoading(false);
    }
  };
 
  return { resumes, loading, error, refreshResumes };
};
 
export const useInterviewSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        await mongoDBService.connect();
        const data = await mongoDBService.getAllInterviewSessions();
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setError('Failed to fetch interview sessions');
      } finally {
        setLoading(false);
      }
    };
 
    fetchSessions();
  }, []);
 
  const refreshSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mongoDBService.getAllInterviewSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to refresh sessions:', error);
      setError('Failed to refresh interview sessions');
    } finally {
      setLoading(false);
    }
  };
 
  return { sessions, loading, error, refreshSessions };
};
 
export const useResumeAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        await mongoDBService.connect();
        const data = await mongoDBService.getResumeAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch resume analytics:', error);
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
 
    fetchAnalytics();
  }, []);
 
  return { analytics, loading, error };
};
 
export const useInterviewAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        await mongoDBService.connect();
        const data = await mongoDBService.getInterviewAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch interview analytics:', error);
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
 
    fetchAnalytics();
  }, []);
 
  return { analytics, loading, error };
};
 

