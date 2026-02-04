import { useState, useCallback } from 'react';
import { resumeParserService, ResumeUploadResponse, ResumeParseResponse, ResumeDetailsResponse } from '../services/resumeParserService';

export interface UseResumeParserState {
  uploading: boolean;
  parsing: boolean;
  progress: number;
  uploadResult: ResumeUploadResponse | null;
  parseResult: ResumeParseResponse | null;
  resumeDetails: ResumeDetailsResponse | null;
  error: string | null;
}

export const useResumeParser = () => {
  const [state, setState] = useState<UseResumeParserState>({
    uploading: false,
    parsing: false,
    progress: 0,
    uploadResult: null,
    parseResult: null,
    resumeDetails: null,
    error: null,
  });

  const resetState = useCallback(() => {
    setState({
      uploading: false,
      parsing: false,
      progress: 0,
      uploadResult: null,
      parseResult: null,
      resumeDetails: null,
      error: null,
    });
  }, []);

  const uploadResume = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, uploading: true, error: null, progress: 0 }));

    try {
      const result = await resumeParserService.uploadResume(file);
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        uploadResult: result,
        progress: 100 
      }));
      return result;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        error: error.response?.data?.error?.message || 'Upload failed' 
      }));
      throw error;
    }
  }, []);

  const parseResume = useCallback(async (resumeId: string, options?: any) => {
    setState(prev => ({ ...prev, parsing: true, error: null }));

    try {
      const result = await resumeParserService.parseResume(resumeId, options);
      setState(prev => ({ 
        ...prev, 
        parsing: false, 
        parseResult: result 
      }));
      return result;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        parsing: false, 
        error: error.response?.data?.error?.message || 'Parsing failed' 
      }));
      throw error;
    }
  }, []);

  const uploadAndParseResume = useCallback(async (file: File, parseOptions?: any) => {
    setState(prev => ({ ...prev, uploading: true, parsing: true, error: null, progress: 0 }));

    try {
      const result = await resumeParserService.uploadAndParseResume(file, parseOptions);
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        parsing: false, 
        uploadResult: result.upload,
        parseResult: result.parse,
        progress: 100 
      }));
      return result;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        parsing: false, 
        error: error.response?.data?.error?.message || 'Upload and parse failed' 
      }));
      throw error;
    }
  }, []);

  const getResumeDetails = useCallback(async (resumeId: string) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const result = await resumeParserService.getResumeDetails(resumeId);
      setState(prev => ({ ...prev, resumeDetails: result }));
      return result;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.response?.data?.error?.message || 'Failed to get resume details' 
      }));
      throw error;
    }
  }, []);

  const reparseResume = useCallback(async (resumeId: string, options?: any) => {
    setState(prev => ({ ...prev, parsing: true, error: null }));

    try {
      const result = await resumeParserService.reparseResume(resumeId, options);
      setState(prev => ({ 
        ...prev, 
        parsing: false, 
        parseResult: result 
      }));
      return result;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        parsing: false, 
        error: error.response?.data?.error?.message || 'Re-parsing failed' 
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    uploadResume,
    parseResume,
    uploadAndParseResume,
    getResumeDetails,
    reparseResume,
    resetState,
  };
};
