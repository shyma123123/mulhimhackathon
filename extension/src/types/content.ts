/**
 * Content Types for SmartShield Extension
 * 
 * Type definitions for content extraction and analysis
 */

export interface ContentData {
  url: string;
  title: string;
  text: string;
  forms: FormData[];
  links: LinkData[];
  images: ImageData[];
  headers: string[];
  timestamp: number;
  snapshotHash: string;
  emailData?: EmailData;
}

export interface FormData {
  action: string;
  method: string;
  inputs: FormInput[];
}

export interface FormInput {
  type: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}

export interface LinkData {
  href: string;
  text: string;
  title?: string;
  isExternal: boolean;
}

export interface ImageData {
  src: string;
  alt?: string;
  title?: string;
}

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  date: string;
  replyTo?: string;
  headers: string[];
}

export interface DetectionResult {
  score: number;
  label: 'clean' | 'suspicious' | 'phishing';
  reasons: string[];
  confidence: number;
  localAnalysis: boolean;
  requiresCloudAnalysis: boolean;
  metadata: {
    urlScore?: number;
    contentScore?: number;
    headerScore?: number;
    socialEngineeringScore?: number;
  };
}

export interface Config {
  enabled: boolean;
  lowThreshold: number;
  highThreshold: number;
  reportThreshold: number;
  privacyMode: boolean;
  notifications: boolean;
  dataRetentionDays: number;
  backendUrl: string;
}
