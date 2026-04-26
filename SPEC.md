# iPhone Case Maker - Specification Document

## 1. Project Overview

**Project Name:** iPhone Case Maker  
**Project Type:** Web Application (3D Customization Tool)  
**Core Functionality:** A web-based tool that allows users to upload an image and automatically apply it onto the back surface of a phone case STL model, generating a real-time 3D preview with export capabilities.  
**Target Users:** Custom phone case enthusiasts, 3D printing hobbyists, e-commerce sellers, and designers.

---

## 2. UI/UX Specification

### 2.1 Layout Structure

**Page Sections:**
- **Header** - Compact top bar with logo and export options
- **Main Content** - Split view with 3D viewer (left/center, ~70%) and sidebar controls (right, ~30%)
- **3D Viewer** - Interactive Three.js canvas with the phone case model
- **Control Panel** - Vertical sidebar on the right with upload and adjustment controls

**Responsive Breakpoints:**
- Desktop: Full split view layout (>1024px)
- Tablet/Mobile: Stacked layout with collapsible controls (<1024px)

### 2.2 Visual Design

**Color Palette:**
- Background: `#0D0D0D` (deep black)
- Surface: `#1A1A1A` (dark charcoal)
- Surface Elevated: `#252525` (lighter charcoal)
- Primary Accent: `#00D9FF` (electric cyan)
- Secondary Accent: `#FF3366` (vibrant pink)
- Text Primary: `#FFFFFF`
- Text Secondary: `#A0A0A0`
- Border: `#333333`

**Typography:**
- Font Family: `'Outfit', sans-serif` (headings), `'JetBrains Mono', monospace` (labels)
- Heading (H1): 24px, weight 600
- Heading (H2): 16px, weight 500
- Body: 13px, weight 400
- Labels: 11px, weight 500, uppercase, letter-spacing 0.5px

**Spacing System:**
- Base unit: 8px
- Padding small: 8px
- Padding medium: 16px
- Padding large: 24px
- Gap: 12px
- Border radius: 8px (buttons), 12px (panels)

**Visual Effects:**
- Box shadows: `0 4px 24px rgba(0, 217, 255, 0.1)` (accent glow)
- Backdrop blur: 12px on panels
- Transitions: 200ms ease-out for all interactive elements
- Canvas glow effect around the 3D viewer

### 2.3 Components

**Header Bar:**
- Logo text: "CASE.MAKER" with gradient (cyan to pink)
- Export button (primary styled)
- Height map toggle (secondary)

**Upload Zone:**
- Dashed border dropzone (`#333333` default, `#00D9FF` on hover)
- Drag-and-drop support
- Click to browse trigger
- Accepts PNG, JPG, JPEG formats
- Preview thumbnail after upload

**3D Viewer:**
- Full-width canvas with subtle blue ambient glow
- Orbit controls (rotate, zoom, pan)
- Auto-rotation toggle
- Reset view button

**Adjustment Sliders:**
- Position X, Y, Z (range: -50 to 50)
- Scale (range: 0.5 to 2.0)
- Rotation (range: -180 to 180)
- Opacity (range: 0 to 1)
- Minimal track design with cyan accent color

**Export Panel:**
- Export PNG button (high-quality render)
- Export STL button (with height map option)
- Resolution selector for PNG (1080p, 2K, 4K)

**States:**
- Buttons: Default → Hover (glow) → Active (pressed) → Disabled (50% opacity)
- Sliders: Track with cyan fill, circular thumb
- Upload zone: Dashed border animates on drag-over

---

## 3. Functionality Specification

### 3.1 Core Features

**STL Model Loading:**
- Default model: `iphone-17.stl` from project root
- Use Three.js STLLoader for parsing
- Center and scale model to fit viewport
- Apply plastic-like material (MeshPhysicalMaterial with clearcoat)

**3D Viewer:**
- Interactive OrbitControls for rotation, zoom, pan
- Auto-rotation option (toggleable)
- Reset camera view button
- Ambient + directional lighting setup
- Environment map for realistic reflections
- Anti-aliasing enabled
- Shadow rendering for depth

**Image Upload:**
- Drag-and-drop or click to upload
- Accept: PNG, JPG, JPEG
- Max file size: 10MB
- Display preview thumbnail
- Clear/remove image option

**Decal Projection:**
- Use Three.js DecalGeometry or custom projection
- Target back surface of phone case (predefined area)
- Image treated as sticker/decal on surface
- Default positioning: centered, scaled to fit bounding area
- Default scale: 70% of surface area for margin
- Supports curved surface projection

**Adjustment Controls:**
- Position X/Y: Move decal horizontally
- Scale: Resize the applied image
- Rotation: Rotate image around center (-180° to 180°)
- Opacity: Adjust transparency of decal
- All changes reflect in real-time

**Export - PNG:**
- High-quality render (up to 4K resolution)
- No watermark
- Transparent background option
- Download as PNG file

**Export - STL:**
- Export modified STL with decal as geometry
- Optional height map extrusion for 3D printing
- Extrusion depth: 0.1mm - 0.5mm (adjustable)

### 3.2 User Interactions and Flows

**Primary Flow:**
1. User lands on page → Default case displayed in viewer
2. User drags image or clicks upload zone
3. Image automatically projected onto back surface
4. User can optionally adjust position/scale/rotation
5. User clicks export → PNG or STL downloaded

**Secondary Interactions:**
- Toggle auto-rotation in viewer
- Reset view to default camera position
- Toggle height map for STL export
- Switch between light/dark preview backgrounds

### 3.3 Edge Cases

- Invalid file type → Show error toast
- File too large → Show size error
- STL load failure → Show error message, fallback to basic shape
- Mobile device → Simplified controls, touch gestures

---

## 4. Technical Architecture

### 4.1 Stack

- **Framework:** Next.js 14+ (App Router)
- **3D Library:** Three.js with React Three Fiber (@react-three/fiber)
- **3D Utilities:** @react-three/drei, Three.js DecalGeometry
- **Styling:** CSS Modules with CSS Variables
- **State Management:** React useState/useRef

### 4.2 Key Technical Solutions

**STL Loading:**
```
STLLoader → BufferGeometry → Center → MeshPhysicalMaterial
```

**Decal Projection:**
```
Option 1: Three.js DecalGeometry (if available in drei)
Option 2: Custom decal using Plane geometry with depth test
Option 3: Texture projection onto back face normals
```

The decal will be projected onto the back side of the phone case by:
1. Detecting back-facing triangles or predefined area
2. Creating a decal mesh that conforms to surface
3. Applying image as texture with transparency

**Export PNG:**
```
renderer.render(scene, camera) → canvas.toDataURL() → download
```

**Export STL:**
```
Modified mesh geometry → STLExporter → download
```

---

## 5. Acceptance Criteria

### Visual Checkpoints
- [ ] Dark themed interface loads correctly
- [ ] 3D phone case model displays and is interactive
- [ ] Upload zone responds to drag-and-drop
- [ ] Image appears on the back of the case after upload
- [ ] Adjustment sliders update the decal in real-time
- [ ] Export buttons generate downloadable files
- [ ] UI is minimal and clean

### Functional Checkpoints
- [ ] Default STL loads on page load
- [ ] Image upload accepts PNG/JPG only
- [ ] Rotation/zoom/pan controls work smoothly
- [ ] Decal is centered by default on the back surface
- [ ] Position/scale/rotation sliders work
- [ ] PNG export produces high-quality image
- [ ] STL export produces valid 3D file

### Performance Checkpoints
- [ ] Initial load under 3 seconds
- [ ] Decal updates under 100ms
- [ ] Smooth 60fps during rotation
- [ ] Export completes under 5 seconds

---

## 6. File Structure

```
ipcasemaker/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── components/
│       ├── Viewer.tsx
│       ├── ControlPanel.tsx
│       ├─�� UploadZone.tsx
│       ├── AdjustmentSliders.tsx
│       └── ExportPanel.tsx
├── public/
│   └── iphone-17.stl (copied from root)
├── package.json
├── next.config.js
└── tsconfig.json
```