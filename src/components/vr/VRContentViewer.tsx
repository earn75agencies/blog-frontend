import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vrContentService, VRContent, VR3DModel, SpatialAudio } from '../../services/vr-content.service';
import { FiLoader, FiPlay, FiHeadphones, FiBox, FiSettings, FiDownload, FiShare2, FiHeart } from 'react-icons/fi';
import * as THREE from 'three';

interface VRContentViewerProps {}

export default function VRContentViewer({}: VRContentViewerProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vrContent, setVrContent] = useState<VRContent | null>(null);
  const [models, setModels] = useState<VR3DModel[]>([]);
  const [spatialAudios, setSpatialAudios] = useState<SpatialAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVRMode, setIsVRMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState<VR3DModel | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<SpatialAudio | null>(null);

  useEffect(() => {
    if (id) {
      loadVRContent(id);
    }
  }, [id]);

  const loadVRContent = async (contentId: string) => {
    try {
      setLoading(true);
      const [contentData, modelsData, audioData] = await Promise.all([
        vrContentService.getVRContent(contentId),
        vrContentService.get3DModels(contentId),
        vrContentService.getSpatialAudio(contentId),
      ]);

      setVrContent(contentData.vrContent);
      setModels(modelsData.models || []);
      setSpatialAudios(audioData.spatialAudios || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load VR content');
    } finally {
      setLoading(false);
    }
  };

  const enterVRMode = async () => {
    if (!vrContent) return;

    try {
      // Check device compatibility
      const compatibility = await vrContentService.checkDeviceCompatibility();
      
      if (!compatibility.supported) {
        alert(`VR not supported on this device. ${compatibility.deviceType} lacks: ${compatibility.capabilities.join(', ')}`);
        return;
      }

      // Enter VR mode
      setIsVRMode(true);
      
      // In a real implementation, this would initialize WebXR
      if ((navigator as any).xr) {
        try {
          const isSupported = await (navigator as any).xr.isSessionSupported('immersive-vr');
          if (isSupported) {
            const session = await (navigator as any).xr.requestSession('immersive-vr');
            // Initialize VR scene
            initializeVRScene(session);
          }
        } catch (err) {
          console.error('VR session failed:', err);
          alert('Failed to start VR session. Please check your VR headset connection.');
        }
      } else {
        // Fallback to 360° viewer
        initialize360Viewer();
      }
    } catch (err: any) {
      alert(`Failed to enter VR mode: ${err.message}`);
    }
  };

  const initializeVRScene = (session: any) => {
    // Initialize Three.js scene for VR
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setSession(session);

    // Add 3D models
    models.forEach(model => {
      load3DModel(model, scene);
    });

    // Add spatial audio
    spatialAudios.forEach(audio => {
      loadSpatialAudio(audio, scene);
    });

    // VR render loop
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  const initialize360Viewer = () => {
    // Initialize 360° media viewer
    const video = document.createElement('video');
    video.src = vrContent?.media[0]?.url || '';
    video.loop = true;
    video.play();

    // Create 360° video sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.VideoTexture(video);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    // Add to scene...
  };

  const load3DModel = (model: VR3DModel, scene: any) => {
    // Load 3D model using Three.js
    const loader = new THREE.GLTFLoader();
    loader.load(model.modelUrl, (gltf: any) => {
      const object = gltf.scene;
      object.position.set(
        object.position.x || 0,
        object.position.y || 0,
        object.position.z || 0
      );
      scene.add(object);
    });
  };

  const loadSpatialAudio = (audio: SpatialAudio, scene: any) => {
    // Create positional audio
    const listener = new THREE.AudioListener();
    const sound = new THREE.PositionalAudio(listener);

    const audioElement = new Audio(audio.audioUrl);
    sound.setNode(audioElement);
    
    // Set 3D position
    if (audio.spatialSettings?.position3D) {
      sound.position.set(
        audio.spatialSettings.position3D.x,
        audio.spatialSettings.position3D.y,
        audio.spatialSettings.position3D.z
      );
    }

    sound.setRefDistance(audio.spatialSettings?.maxDistance || 100);
    sound.setRolloffFactor(audio.spatialSettings?.rolloffFactor || 1);
    
    scene.add(sound);
    audioElement.play();
  };

  const handleLike = async () => {
    if (!vrContent) return;
    try {
      // Like the content
      await vrContentService.updateVRContent(vrContent._id, { 
        title: vrContent.title 
      });
    } catch (err) {
      console.error('Failed to like content:', err);
    }
  };

  const handleShare = async () => {
    if (!vrContent) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: vrContent.title,
          text: vrContent.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-primary-600 mb-4" />
          <p className="text-gray-600">Loading VR experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!vrContent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{vrContent.title}</h1>
            <p className="text-gray-300">{vrContent.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <FiHeart className="text-xl" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <FiShare2 className="text-xl" />
            </button>
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* VR Viewer */}
      <div className="relative w-full h-screen">
        {!isVRMode ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="mb-8">
                {vrContent.media[0]?.type === 'video' ? (
                  <video
                    className="rounded-lg max-w-2xl"
                    src={vrContent.media[0].url}
                    controls
                    loop
                    muted
                  />
                ) : (
                  <img
                    className="rounded-lg max-w-2xl"
                    src={vrContent.media[0]?.url}
                    alt={vrContent.title}
                  />
                )}
              </div>
            </div>
              
              <button
                onClick={enterVRMode}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-3 mx-auto"
              >
                <FiBox className="text-xl" />
                Enter VR Mode
              </button>
              
              <div className="mt-6 text-gray-400">
                <p>Experience this content in Virtual Reality</p>
                <p className="text-sm mt-2">Requires VR headset or compatible mobile device</p>
              </div>
            </div>
        ) : (
          <div id="vr-container" className="w-full h-full">
            {/* VR scene will be rendered here */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm">VR Mode Active</p>
                <p className="text-xs text-gray-400">Press ESC to exit</p>
              </div>
              <div className="flex space-x-2">
                {models.map(model => (
                  <button
                    key={model._id}
                    onClick={() => setSelectedModel(model)}
                    className={`p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${
                      selectedModel?._id === model._id ? 'bg-white/30' : ''
                    }`}
                  >
                    <FiBox className="text-lg" />
                  </button>
                ))}
                {spatialAudios.map(audio => (
                  <button
                    key={audio._id}
                    onClick={() => setSelectedAudio(audio)}
                    className={`p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${
                      selectedAudio?._id === audio._id ? 'bg-white/30' : ''
                    }`}
                  >
                    <FiHeadphones className="text-lg" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Info Panel */}
      <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Type: {vrContent.type.toUpperCase()}</p>
            <p className="text-sm text-gray-400">Views: {vrContent.views.toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded bg-white/10 hover:bg-white/20 transition-colors">
              <FiSettings className="text-lg" />
            </button>
            <button className="p-2 rounded bg-white/10 hover:bg-white/20 transition-colors">
              <FiDownload className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}