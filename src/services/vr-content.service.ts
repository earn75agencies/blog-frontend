/**
 * VR Content Service
 * Handles VR/AR content API calls
 */

import { API_ENDPOINTS } from '../config/api.config';
import { apiClient } from './api-client';

export interface VRContent {
  _id: string;
  post: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  type: '360' | 'vr' | 'ar' | 'mixed-reality';
  title: string;
  description: string;
  media: {
    type: string;
    url: string;
    thumbnail?: string;
    duration?: number;
  }[];
  interactiveElements: {
    type: string;
    position: { x: number; y: number; z: number };
    data: any;
  }[];
  settings: {
    enableVR?: boolean;
    enableAR?: boolean;
    requireHeadset?: boolean;
    compatibility?: string[];
  };
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface VR3DModel {
  _id: string;
  post: string;
  author: string;
  name: string;
  modelUrl: string;
  thumbnail?: string;
  format: 'gltf' | 'glb' | 'obj' | 'fbx';
  size: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  interactive: boolean;
  animations: {
    name: string;
    duration: number;
    loop: boolean;
  }[];
  materials: {
    name: string;
    type: string;
    properties: any;
  }[];
  settings: any;
  createdAt: string;
}

export interface SpatialAudio {
  _id: string;
  content: string;
  contentType: 'vr-content' | 'post';
  audioUrl: string;
  format: 'binaural' | 'ambisonic' | 'stereo' | 'mono';
  channels: number;
  sampleRate: number;
  spatialSettings: {
    position3D?: { x: number; y: number; z: number };
    distanceModel?: 'linear' | 'inverse' | 'exponential';
    maxDistance?: number;
    rolloffFactor?: number;
    coneInnerAngle?: number;
    coneOuterAngle?: number;
    coneOuterGain?: number;
  };
  isLooping: boolean;
  volume: number;
  createdAt: string;
}

export const vrContentService = {
  // VR Content CRUD
  createVRContent: async (data: Partial<VRContent>): Promise<{ vrContent: VRContent }> => {
    const response = await apiClient.post(API_ENDPOINTS.VR.CONTENT.CREATE(), data);
    return response.data;
  },

  getVRContent: async (id: string): Promise<{ vrContent: VRContent }> => {
    const response = await apiClient.get(API_ENDPOINTS.VR.CONTENT.GET(id));
    return response.data;
  },

  updateVRContent: async (id: string, data: Partial<VRContent>): Promise<{ vrContent: VRContent }> => {
    const response = await apiClient.put(API_ENDPOINTS.VR.CONTENT.UPDATE(id), data);
    return response.data;
  },

  deleteVRContent: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.VR.CONTENT.DELETE(id));
  },

  getUserVRContent: async (userId?: string): Promise<{ vrContents: VRContent[] }> => {
    const url = userId ? API_ENDPOINTS.VR.CONTENT.USER(userId) : API_ENDPOINTS.VR.CONTENT.MINE();
    const response = await apiClient.get(url);
    return response.data;
  },

  // 3D Models
  add3DModel: async (contentId: string, data: Partial<VR3DModel>): Promise<{ model: VR3DModel }> => {
    const response = await apiClient.post(API_ENDPOINTS.VR.CONTENT.ADD_3D_MODEL(contentId), data);
    return response.data;
  },

  get3DModels: async (contentId: string): Promise<{ models: VR3DModel[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.VR.CONTENT.GET_3D_MODELS(contentId));
    return response.data;
  },

  update3DModel: async (modelId: string, data: Partial<VR3DModel>): Promise<{ model: VR3DModel }> => {
    const response = await apiClient.put(API_ENDPOINTS.VR.CONTENT.UPDATE_3D_MODEL(modelId), data);
    return response.data;
  },

  delete3DModel: async (modelId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.VR.CONTENT.DELETE_3D_MODEL(modelId));
  },

  // Spatial Audio
  addSpatialAudio: async (contentId: string, data: Partial<SpatialAudio>): Promise<{ spatialAudio: SpatialAudio }> => {
    const response = await apiClient.post(API_ENDPOINTS.VR.CONTENT.ADD_SPATIAL_AUDIO(contentId), data);
    return response.data;
  },

  getSpatialAudio: async (contentId: string): Promise<{ spatialAudios: SpatialAudio[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.VR.CONTENT.GET_SPATIAL_AUDIO(contentId));
    return response.data;
  },

  updateSpatialAudio: async (audioId: string, data: Partial<SpatialAudio>): Promise<{ spatialAudio: SpatialAudio }> => {
    const response = await apiClient.put(API_ENDPOINTS.VR.CONTENT.UPDATE_SPATIAL_AUDIO(audioId), data);
    return response.data;
  },

  deleteSpatialAudio: async (audioId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.VR.CONTENT.DELETE_SPATIAL_AUDIO(audioId));
  },

  // VR Content Discovery
  getFeaturedVR: async (): Promise<{ vrContents: VRContent[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.VR.CONTENT.FEATURED());
    return response.data;
  },

  getTrendingVR: async (timeframe: 'day' | 'week' | 'month' = 'week'): Promise<{ vrContents: VRContent[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.VR.CONTENT.TRENDING(timeframe));
    return response.data;
  },

  searchVRContent: async (query: string, filters?: {
    type?: string;
    compatibility?: string;
    interactive?: boolean;
  }): Promise<{ vrContents: VRContent[] }> => {
    const params = new URLSearchParams();
    params.append('query', query);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.compatibility) params.append('compatibility', filters.compatibility);
    if (filters?.interactive !== undefined) params.append('interactive', filters.interactive.toString());
    const response = await apiClient.get(`${API_ENDPOINTS.VR.CONTENT.SEARCH()}?${params}`);
    return response.data;
  },

  // VR Analytics
  getVRAnalytics: async (contentId: string): Promise<{
    views: number;
    interactions: number;
    avgSessionDuration: number;
    deviceBreakdown: Record<string, number>;
    popularFeatures: string[];
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.VR.CONTENT.ANALYTICS(contentId));
    return response.data;
  },

  // VR Settings
  updateVRSettings: async (contentId: string, settings: VRContent['settings']): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.VR.CONTENT.UPDATE_SETTINGS(contentId), { settings });
  },

  // VR Compatibility Check
  checkDeviceCompatibility: async (): Promise<{
    supported: boolean;
    deviceType: string;
    capabilities: string[];
    recommendedSettings: any;
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.VR.CONTENT.CHECK_COMPATIBILITY());
    return response.data;
  },
};