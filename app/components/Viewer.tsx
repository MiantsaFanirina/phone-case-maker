'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { 
  MeshStandardMaterial,
  TextureLoader,
  SRGBColorSpace,
  NearestFilter,
} from 'three';
import { useStore } from '../store';
import * as THREE from 'three';

function PhoneCase() {
  const groupRef = useRef<THREE.Group>(null);
  const { 
    imageUrl, 
    scale, 
    opacity,
    caseColor,
    caseFinish,
  } = useStore();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [stickerGeometry, setStickerGeometry] = useState<THREE.BufferGeometry | null>(null);

  const materialProps = {
    glossy: { metalness: 0.0, roughness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.1 },
    matte: { metalness: 0.0, roughness: 0.95, clearcoat: 0.0, clearcoatRoughness: 0.5 },
    rubber: { metalness: 0.0, roughness: 1.0, clearcoat: 0.0, clearcoatRoughness: 1.0 },
  }[caseFinish] || { metalness: 0.0, roughness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.1 };

  useEffect(() => {
    const loadSTL = async () => {
      try {
        const response = await fetch('/iphone-17.stl');
        if (!response.ok) return;
        
        const buffer = await response.arrayBuffer();
        const loader = new STLLoader();
        const geo = loader.parse(buffer);
        
        if (!geo) return;
        
        geo.computeVertexNormals();
        
        const center = new THREE.Vector3();
        geo.computeBoundingBox();
        
        if (geo.boundingBox) {
          geo.boundingBox.getCenter(center);
          geo.translate(-center.x, -center.y, -center.z);
          
          const maxDim = Math.max(
            geo.boundingBox.max.x - geo.boundingBox.min.x,
            geo.boundingBox.max.y - geo.boundingBox.min.y,
            geo.boundingBox.max.z - geo.boundingBox.min.z
          );
          const scaleFactor = 100 / maxDim;
          geo.scale(scaleFactor, scaleFactor, scaleFactor);
          geo.computeBoundingBox();
        }
        
        setGeometry(geo);
        
        const stickerGeo = createBackfaceSticker(geo, scale);
        setStickerGeometry(stickerGeo);
        
        setModelLoaded(true);
      } catch (error) {
        console.error('Failed to load STL:', error);
        setModelLoaded(true);
      }
    };
    
    loadSTL();
  }, []);

  useEffect(() => {
    if (geometry && scale) {
      const stickerGeo = createBackfaceSticker(geometry, scale);
      setStickerGeometry(stickerGeo);
    }
  }, [geometry, scale]);

  useEffect(() => {
    if (!imageUrl) {
      setTexture(null);
      return;
    }
    
    const loader = new TextureLoader();
    loader.load(
      imageUrl,
      (tex) => {
        tex.colorSpace = SRGBColorSpace;
        tex.minFilter = NearestFilter;
        tex.magFilter = NearestFilter;
        setTexture(tex);
      },
      undefined,
      (error) => console.error('Failed to load texture:', error)
    );
  }, [imageUrl]);

  if (!modelLoaded) {
    return (
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[60, 120, 10]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      {geometry && (
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color={caseColor}
            metalness={materialProps.metalness}
            roughness={materialProps.roughness}
            clearcoat={materialProps.clearcoat}
            clearcoatRoughness={materialProps.clearcoatRoughness}
          />
        </mesh>
      )}
      
      {stickerGeometry && texture && (
        <mesh geometry={stickerGeometry}>
          <meshPhysicalMaterial
            map={texture}
            transparent={true}
            opacity={opacity}
            roughness={materialProps.roughness}
            metalness={materialProps.metalness}
            clearcoat={materialProps.clearcoat}
            clearcoatRoughness={materialProps.clearcoatRoughness}
          />
        </mesh>
      )}
    </group>
  );
}

function createBackfaceSticker(
  originalGeo: THREE.BufferGeometry,
  scale: number
): THREE.BufferGeometry {
  const positions = originalGeo.attributes.position;
  const normals = originalGeo.attributes.normal;
  
  if (!positions || !normals) {
    return new THREE.BufferGeometry();
  }
  
  originalGeo.computeBoundingBox();
  const bounds = originalGeo.boundingBox;
  
  if (!bounds) {
    return new THREE.BufferGeometry();
  }
  
  const stickerVertices: number[] = [];
  const stickerNormals: number[] = [];
  const stickerUvs: number[] = [];
  const stickerIndices: number[] = [];
  
  const width = bounds.max.x - bounds.min.x;
  const height = bounds.max.y - bounds.min.y;
  const minX = bounds.min.x;
  const minY = bounds.min.y;
  
  let triCount = 0;
  let vertexCount = 0;
  
  for (let i = 0; i < positions.count; i += 3) {
    const nz0 = normals.getZ(i);
    const nz1 = normals.getZ(i + 1);
    const nz2 = normals.getZ(i + 2);
    
    const isBackFace = nz0 < -0.5 || nz1 < -0.5 || nz2 < -0.5;
    
    if (isBackFace) {
      for (let j = 0; j < 3; j++) {
        const idx = i + j;
        const x = positions.getX(idx);
        const y = positions.getY(idx);
        const z = positions.getZ(idx);
        
        const nx = normals.getX(idx);
        const ny = normals.getY(idx);
        const nz = normals.getZ(idx);
        
        const u = (x - minX) / width;
        const v = (y - minY) / height;
        
        stickerVertices.push(x, y, z);
        stickerNormals.push(nx, ny, nz);
        stickerUvs.push(u, v);
        stickerIndices.push(vertexCount);
        vertexCount++;
      }
      triCount++;
    }
  }
  
  console.log('Back face triangles:', triCount);
  
  const stickerGeo = new THREE.BufferGeometry();
  stickerGeo.setAttribute('position', new THREE.Float32BufferAttribute(stickerVertices, 3));
  stickerGeo.setAttribute('normal', new THREE.Float32BufferAttribute(stickerNormals, 3));
  stickerGeo.setAttribute('uv', new THREE.Float32BufferAttribute(stickerUvs, 2));
  stickerGeo.setIndex(stickerIndices);
  stickerGeo.computeVertexNormals();
  
  return stickerGeo;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />
      <pointLight position={[0, -5, 5]} intensity={0.2} color="#ffffff" />
    </>
  );
}

function Scene() {
  const { autoRotate } = useStore();

  return (
    <>
      <Lights />
      <Center>
        <PhoneCase />
      </Center>
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={50}
        maxDistance={300}
        dampingFactor={0.05}
        enableDamping
      />
      <Environment preset="city" background={false} />
    </>
  );
}

export default function Viewer({ onResetView }: { onResetView: () => void }) {
  return (
    <div className="viewer-container">
      <div className="viewer-glow" />
      <Canvas
        className="viewer-canvas"
        camera={{ position: [0, 0, 150], fov: 45 }}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}