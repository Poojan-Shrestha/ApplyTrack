export interface User {
  _id: string;
  email: string;
  fullName: string;
  profileImage?: string;
  profile?: {
    phone?: string;
    location?: string;
    linkedIn?: string;
    portfolio?: string;
    bio?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  userId: string;
  title: string;
  company: string;
  location?: string;
  jobUrl?: string;
  salaryRange?: string;
  description?: string;
  requirements?: string;
  status: JobStatus;
  appliedDate?: string;
  notes?: string;
  atsScore?: number;
  atsAnalysis?: ATSAnalysis | null;
  atsAnalyzedResumeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = 
  | 'saved' 
  | 'applied' 
  | 'interviewing' 
  | 'offered' 
  | 'rejected' 
  | 'withdrawn';

export interface ATSAnalysis {
  overallScore: number;
  keywordMatch: number;
  formattingScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  suggestions: string[];
  analyzedAt: string;
}

export interface Resume {
  _id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  fileUrl: string;
  fileId: string;
  fileSize: number;
  mimeType: string;
  isDefault: boolean;
  analysis?: ResumeAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeAnalysis {
  structureScore: number;
  contentScore: number;
  missingSections: string[];
  suggestions: string[];
  analyzedAt: string;
}

export interface InterviewPrep {
  _id: string;
  jobId: string | Job;
  userId: string;
  behavioral: BehavioralQuestion[];
  technical: TechnicalQuestion[];
  questionsToAsk: QuestionToAsk[];
  tips: string[];
  mistakesToAvoid: string[];
  version: number;
  isActive: boolean;
  viewCount: number;
  lastViewedAt?: string;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BehavioralQuestion {
  question: string;
  why_asked: string;
  answer_framework: string;
}

export interface TechnicalQuestion {
  question: string;
  key_points: string[];
}

export interface QuestionToAsk {
  question: string;
  purpose: string;
}

export interface DashboardStats {
  totalJobs: number;
  totalResumes: number;
  jobsByStatus: {
    saved: number;
    applied: number;
    interviewing: number;
    offered: number;
    rejected: number;
    withdrawn: number;
  };
  recentApplications: Job[];
  successRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface JobFilters {
  status?: JobStatus | 'all';
  search?: string;
}

export interface FormErrors {
  [key: string]: string;
}