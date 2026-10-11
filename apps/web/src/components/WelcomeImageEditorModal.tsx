'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Palette, Type, X, Check, ChevronDown, ChevronRight, Move } from 'lucide-react';

export interface ImageConfig {
  backgroundType: 'gradient' | 'solid' | 'image';
  backgroundColor: string;
  backgroundImageUrl?: string;
  backgroundImageFit?: 'cover' | 'contain' | 'stretch';
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: 'horizontal' | 'vertical' | 'diagonal';
  avatarSize: number;
  avatarX: number;
  avatarBorderColor: string;
  avatarBorderWidth: number;
  welcomeText: string;
  welcomeSize: number;
  welcomeColor: string;
  welcomeFont: string;
  welcomeEnabled: boolean;
  welcomeX: number;
  welcomeY: number;
  usernameSize: number;
  usernameColor: string;
  usernameFont: string;
  usernameEnabled: boolean;
  usernameX: number;
  usernameY: number;
  memberCountSize: number;
  memberCountColor: string;
  memberCountFont: string;
  memberCountEnabled: boolean;
  memberCountX: number;
  memberCountY: number;
  serverNameSize: number;
  serverNameColor: string;
  serverNameFont: string;
  serverNameEnabled: boolean;
  serverNameX: number;
  serverNameY: number;
}

interface WelcomeImageEditorModalProps {
  onSave: (config: ImageConfig) => void;
  onClose: () => void;
  initialConfig?: ImageConfig;
}

const defaultConfig: ImageConfig = {
  backgroundType: 'gradient',
  backgroundColor: '#5865F2',
  gradientStart: '#5865F2',
  gradientEnd: '#7289DA',
  gradientDirection: 'diagonal',
  avatarSize: 120,
  avatarX: 80,
  avatarBorderColor: '#FFFFFF',
  avatarBorderWidth: 5,
  welcomeText: 'WELCOME',
  welcomeSize: 48,
  welcomeColor: '#FFFFFF',
  welcomeFont: 'Arial',
  welcomeEnabled: true,
  welcomeX: 220,
  welcomeY: 110,
  usernameSize: 36,
  usernameColor: '#FFFFFF',
  usernameFont: 'Arial',
  usernameEnabled: true,
  usernameX: 220,
  usernameY: 160,
  memberCountSize: 24,
  memberCountColor: '#CCCCCC',
  memberCountFont: 'Arial',
  memberCountEnabled: true,
  memberCountX: 220,
  memberCountY: 200,
  serverNameSize: 24,
  serverNameColor: '#CCCCCC',
  serverNameFont: 'Arial',
  serverNameEnabled: true,
  serverNameX: 220,
  serverNameY: 240,
};

const FONTS = ['Arial', 'Helvetica', 'Verdana', 'Georgia', 'Impact', 'Courier New', 'Trebuchet MS', 'Comic Sans MS'];

const templates = [
  { name: 'Classic Discord', emoji: '💜', category: 'Modern', config: { ...defaultConfig } },
  { name: 'Minimal Dark', emoji: '🖤', category: 'Minimalist', config: { ...defaultConfig, backgroundType: 'solid' as const, backgroundColor: '#18181B', gradientStart: '#18181B', gradientEnd: '#27272A', welcomeColor: '#FFFFFF', usernameColor: '#E4E4E7', memberCountColor: '#A1A1AA', serverNameColor: '#71717A' } },
  { name: 'Ocean Breeze', emoji: '🌊', category: 'Modern', config: { ...defaultConfig, gradientStart: '#006BA6', gradientEnd: '#0496FF', welcomeColor: '#FFFFFF', usernameColor: '#E0F7FF', memberCountColor: '#B3E5FC', serverNameColor: '#81D4FA' } },
  { name: 'Purple Royalty', emoji: '👑', category: 'Modern', config: { ...defaultConfig, gradientStart: '#6A1B9A', gradientEnd: '#9C27B0', avatarBorderColor: '#FFD700', avatarBorderWidth: 8, welcomeColor: '#FFD700', usernameColor: '#FFFFFF', memberCountColor: '#E1BEE7', serverNameColor: '#CE93D8' } },
  { name: 'Sunset Glow', emoji: '🌅', category: 'Modern', config: { ...defaultConfig, gradientStart: '#FF6B35', gradientEnd: '#F7931E', welcomeColor: '#FFFFFF', usernameColor: '#FFF8DC', memberCountColor: '#FFE4B5', serverNameColor: '#FFDAB9' } },
  { name: 'Cyberpunk', emoji: '🌃', category: 'Gaming', config: { ...defaultConfig, gradientStart: '#0D0221', gradientEnd: '#1B0E3D', gradientDirection: 'horizontal' as const, avatarBorderColor: '#00FFF0', welcomeText: 'CONNECTED', welcomeColor: '#00FFF0', usernameColor: '#FF00E5', memberCountColor: '#00FFF0', serverNameColor: '#A366FF' } },
  { name: 'Gaming RGB', emoji: '🎮', category: 'Gaming', config: { ...defaultConfig, gradientStart: '#1A0033', gradientEnd: '#330066', gradientDirection: 'horizontal' as const, avatarBorderColor: '#00FF00', welcomeText: 'PLAYER JOINED', welcomeColor: '#00FF00', usernameColor: '#00FFFF', memberCountColor: '#FF00FF', serverNameColor: '#FFFF00' } },
  { name: 'Matrix Code', emoji: '💻', category: 'Gaming', config: { ...defaultConfig, backgroundType: 'solid' as const, backgroundColor: '#000000', avatarBorderColor: '#00FF00', welcomeText: '> ACCESS GRANTED', welcomeColor: '#00FF00', usernameColor: '#00FF00', memberCountColor: '#00DD00', serverNameColor: '#00BB00' } },
  { name: 'Anime Vibe', emoji: '🎌', category: 'Anime', config: { ...defaultConfig, gradientStart: '#FF1744', gradientEnd: '#FF6E40', welcomeText: 'ようこそ', welcomeColor: '#FFFFFF', usernameColor: '#FFE082', memberCountColor: '#FFCCBC', serverNameColor: '#FFAB91' } },
  { name: 'Dark Anime', emoji: '⚡', category: 'Anime', config: { ...defaultConfig, gradientStart: '#16213E', gradientEnd: '#0F3460', gradientDirection: 'horizontal' as const, avatarBorderColor: '#E94560', welcomeText: 'ようこそ', welcomeColor: '#E94560', usernameColor: '#FFFFFF', memberCountColor: '#F0A500', serverNameColor: '#BBBBBB' } },
  { name: 'Sakura Dream', emoji: '🌸', category: 'Anime', config: { ...defaultConfig, gradientStart: '#F8BBD0', gradientEnd: '#FF80AB', gradientDirection: 'vertical' as const, welcomeColor: '#880E4F', usernameColor: '#C2185B', memberCountColor: '#AD1457', serverNameColor: '#E91E63' } },
  { name: 'Ice Cool', emoji: '❄️', category: 'Minimalist', config: { ...defaultConfig, gradientStart: '#E1F5FE', gradientEnd: '#B3E5FC', gradientDirection: 'vertical' as const, avatarBorderColor: '#01579B', welcomeColor: '#01579B', usernameColor: '#0277BD', memberCountColor: '#0288D1', serverNameColor: '#039BE5' } },
];

const categories = ['All', 'Modern', 'Anime', 'Gaming', 'Minimalist'];

// Canvas dimensions
const CW = 800;
const CH = 300;

type DragTarget = 'welcome' | 'username' | 'memberCount' | 'serverName' | 'avatar' | null;

function AccordionSection({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.02]" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#F5F4F5" }}>{title}</span>
        </div>
        {open ? <ChevronDown className="w-3.5 h-3.5" style={{ color: "#A8A9A2" }} /> : <ChevronRight className="w-3.5 h-3.5" style={{ color: "#A8A9A2" }} />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

const inputSt = { width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#F5F4F5", fontSize: 12, outline: "none", fontFamily: "inherit" };
const labelSt = { color: "#A8A9A2", fontSize: 10, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 4 };

export function WelcomeImageEditorModal({ onSave, onClose, initialConfig }: WelcomeImageEditorModalProps) {
  const [config, setConfig] = useState<ImageConfig>(initialConfig || defaultConfig);
  const [selCategory, setSelCategory] = useState('All');
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [dragging, setDragging] = useState<DragTarget>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filteredTemplates = selCategory === 'All' ? templates : templates.filter(t => t.category === selCategory);

  const upd = (u: Partial<ImageConfig>) => setConfig(c => ({ ...c, ...u }));

  // Load bg image
  useEffect(() => {
    if (config.backgroundImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setBgImg(img);
      img.onerror = () => setBgImg(null);
      img.src = config.backgroundImageUrl;
    } else {
      setBgImg(null);
    }
  }, [config.backgroundImageUrl]);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CW, CH);

    // Background
    if (config.backgroundType === 'image' && bgImg) {
      const fit = config.backgroundImageFit || 'cover';
      if (fit === 'stretch') {
        ctx.drawImage(bgImg, 0, 0, CW, CH);
      } else if (fit === 'contain') {
        const sc = Math.min(CW / bgImg.width, CH / bgImg.height);
        const sw = bgImg.width * sc, sh = bgImg.height * sc;
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, CW, CH);
        ctx.drawImage(bgImg, (CW - sw) / 2, (CH - sh) / 2, sw, sh);
      } else {
        const sc = Math.max(CW / bgImg.width, CH / bgImg.height);
        const sw = bgImg.width * sc, sh = bgImg.height * sc;
        ctx.drawImage(bgImg, (CW - sw) / 2, (CH - sh) / 2, sw, sh);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(0, 0, CW, CH);
    } else if (config.backgroundType === 'gradient') {
      const g = config.gradientDirection === 'horizontal'
        ? ctx.createLinearGradient(0, 0, CW, 0)
        : config.gradientDirection === 'vertical'
        ? ctx.createLinearGradient(0, 0, 0, CH)
        : ctx.createLinearGradient(0, 0, CW, CH);
      g.addColorStop(0, config.gradientStart);
      g.addColorStop(1, config.gradientEnd);
      ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
    } else {
      ctx.fillStyle = config.backgroundColor; ctx.fillRect(0, 0, CW, CH);
    }

    // Avatar
    const ay = CH / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(config.avatarX, ay, config.avatarSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#555'; ctx.fill();
    if (config.avatarBorderWidth > 0) {
      ctx.strokeStyle = config.avatarBorderColor;
      ctx.lineWidth = config.avatarBorderWidth;
      ctx.stroke();
    }
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'center';
    ctx.fillText('AVATAR', config.avatarX, ay + 5);
    ctx.restore();

    ctx.textAlign = 'left';
    if (config.welcomeEnabled) {
      ctx.fillStyle = config.welcomeColor;
      ctx.font = `bold ${config.welcomeSize}px ${config.welcomeFont || 'Arial'}`;
      ctx.fillText(config.welcomeText, config.welcomeX, config.welcomeY);
    }
    if (config.usernameEnabled) {
      ctx.fillStyle = config.usernameColor;
      ctx.font = `bold ${config.usernameSize}px ${config.usernameFont || 'Arial'}`;
      ctx.fillText('Username', config.usernameX, config.usernameY);
    }
    if (config.memberCountEnabled) {
      ctx.fillStyle = config.memberCountColor;
      ctx.font = `${config.memberCountSize}px ${config.memberCountFont || 'Arial'}`;
      ctx.fillText('You are member #1234', config.memberCountX, config.memberCountY);
    }
    if (config.serverNameEnabled) {
      ctx.fillStyle = config.serverNameColor;
      ctx.font = `${config.serverNameSize}px ${config.serverNameFont || 'Arial'}`;
      ctx.fillText('Server Name', config.serverNameX, config.serverNameY);
    }

    // Drag hint overlays
    const hint = (x: number, y: number, label: string) => {
      ctx.strokeStyle = 'rgba(31,167,187,0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(x - 4, y - 20, 160, 28);
      ctx.setLineDash([]);
    };
    if (config.welcomeEnabled && dragging === 'welcome') hint(config.welcomeX, config.welcomeY, 'welcome');
    if (config.usernameEnabled && dragging === 'username') hint(config.usernameX, config.usernameY, 'username');
    if (config.memberCountEnabled && dragging === 'memberCount') hint(config.memberCountX, config.memberCountY, 'memberCount');
    if (config.serverNameEnabled && dragging === 'serverName') hint(config.serverNameX, config.serverNameY, 'serverName');
  }, [config, bgImg, dragging]);

  useEffect(() => { draw(); }, [draw]);

  // Hit-test: returns which element is at canvas coords
  const hitTest = (cx: number, cy: number): DragTarget => {
    const hits: [DragTarget, number, number][] = [];
    if (config.welcomeEnabled) hits.push(['welcome', config.welcomeX, config.welcomeY]);
    if (config.usernameEnabled) hits.push(['username', config.usernameX, config.usernameY]);
    if (config.memberCountEnabled) hits.push(['memberCount', config.memberCountX, config.memberCountY]);
    if (config.serverNameEnabled) hits.push(['serverName', config.serverNameX, config.serverNameY]);
    // avatar
    const ay = CH / 2;
    const dist = Math.hypot(cx - config.avatarX, cy - ay);
    if (dist < config.avatarSize / 2) return 'avatar';
    // text boxes (approx 200x30)
    for (const [key, x, y] of hits) {
      if (cx >= x - 4 && cx <= x + 220 && cy >= y - 26 && cy <= y + 8) return key;
    }
    return null;
  };

  const canvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = CW / rect.width;
    const scaleY = CH / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = canvasCoords(e);
    const target = hitTest(x, y);
    if (!target) return;
    setDragging(target);
    if (target === 'avatar') setDragOffset({ x: x - config.avatarX, y: y - CH / 2 });
    else if (target === 'welcome') setDragOffset({ x: x - config.welcomeX, y: y - config.welcomeY });
    else if (target === 'username') setDragOffset({ x: x - config.usernameX, y: y - config.usernameY });
    else if (target === 'memberCount') setDragOffset({ x: x - config.memberCountX, y: y - config.memberCountY });
    else if (target === 'serverName') setDragOffset({ x: x - config.serverNameX, y: y - config.serverNameY });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const { x, y } = canvasCoords(e);
    const nx = Math.round(x - dragOffset.x);
    const ny = Math.round(y - dragOffset.y);
    if (dragging === 'avatar') upd({ avatarX: Math.max(40, Math.min(CW - 40, nx)) });
    else if (dragging === 'welcome') upd({ welcomeX: Math.max(0, Math.min(CW - 50, nx)), welcomeY: Math.max(20, Math.min(CH - 10, ny)) });
    else if (dragging === 'username') upd({ usernameX: Math.max(0, Math.min(CW - 50, nx)), usernameY: Math.max(20, Math.min(CH - 10, ny)) });
    else if (dragging === 'memberCount') upd({ memberCountX: Math.max(0, Math.min(CW - 50, nx)), memberCountY: Math.max(20, Math.min(CH - 10, ny)) });
    else if (dragging === 'serverName') upd({ serverNameX: Math.max(0, Math.min(CW - 50, nx)), serverNameY: Math.max(20, Math.min(CH - 10, ny)) });
  };

  const handleMouseUp = () => setDragging(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => upd({ backgroundType: 'image', backgroundImageUrl: ev.target?.result as string, backgroundImageFit: 'cover' });
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-7xl flex flex-col rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#0e0e10", border: "1px solid rgba(255,255,255,0.08)", height: "90vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: "rgba(31,167,187,0.15)" }}>
              <ImageIcon className="w-4 h-4" style={{ color: "#1FA7BB" }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>Welcome Image Editor</h2>
              <p className="text-xs" style={{ color: "#A8A9A2" }}>Drag elements on the canvas to reposition them</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: "#A8A9A2" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Canvas */}
          <div className="flex-1 flex flex-col p-5" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Move className="w-3.5 h-3.5" style={{ color: "#1FA7BB" }} />
              <span className="text-xs" style={{ color: "#A8A9A2" }}>Click and drag text or avatar to reposition</span>
            </div>
            <div className="flex-1 flex items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <canvas
                ref={canvasRef}
                width={CW}
                height={CH}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="rounded-lg"
                style={{ maxWidth: '100%', height: 'auto', cursor: dragging ? 'grabbing' : 'grab' }}
              />
            </div>
          </div>

          {/* Right panel */}
          <div className="w-80 overflow-y-auto flex flex-col" style={{ background: "#0e0e10" }}>

            {/* Templates */}
            <AccordionSection title="Templates" icon={<ImageIcon className="w-3.5 h-3.5" style={{ color: "#1FA7BB" }} />} defaultOpen>
              <div className="flex gap-1.5 flex-wrap mb-2">
                {categories.map(c => (
                  <button key={c} onClick={() => setSelCategory(c)} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                    style={{ background: selCategory === c ? "#1FA7BB" : "rgba(255,255,255,0.05)", color: selCategory === c ? "#101012" : "#A8A9A2" }}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filteredTemplates.map(t => (
                  <button key={t.name} onClick={() => setConfig(t.config)}
                    className="p-2.5 rounded-xl text-left transition-all hover:bg-white/[0.06]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="text-lg mb-1">{t.emoji}</div>
                    <div className="text-xs font-semibold" style={{ color: "#F5F4F5" }}>{t.name}</div>
                    <div className="text-[10px]" style={{ color: "#A8A9A2" }}>{t.category}</div>
                  </button>
                ))}
              </div>
            </AccordionSection>

            {/* Background */}
            <AccordionSection title="Background" icon={<Palette className="w-3.5 h-3.5" style={{ color: "#1FA7BB" }} />}>
              <div className="flex gap-1.5">
                {(['gradient', 'solid', 'image'] as const).map(t => (
                  <button key={t} onClick={() => upd({ backgroundType: t })} className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all"
                    style={{ background: config.backgroundType === t ? "#1FA7BB" : "rgba(255,255,255,0.05)", color: config.backgroundType === t ? "#101012" : "#A8A9A2" }}>
                    {t}
                  </button>
                ))}
              </div>

              {config.backgroundType === 'gradient' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label style={labelSt}>Start</label><input type="color" value={config.gradientStart} onChange={e => upd({ gradientStart: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.08)" }} /></div>
                    <div><label style={labelSt}>End</label><input type="color" value={config.gradientEnd} onChange={e => upd({ gradientEnd: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.08)" }} /></div>
                  </div>
                  <div>
                    <label style={labelSt}>Direction</label>
                    <select value={config.gradientDirection} onChange={e => upd({ gradientDirection: e.target.value as any })} style={inputSt}>
                      <option value="horizontal" style={{ background: "#121315" }}>Horizontal →</option>
                      <option value="vertical" style={{ background: "#121315" }}>Vertical ↓</option>
                      <option value="diagonal" style={{ background: "#121315" }}>Diagonal ↘</option>
                    </select>
                  </div>
                </>
              )}
              {config.backgroundType === 'solid' && (
                <div><label style={labelSt}>Color</label><input type="color" value={config.backgroundColor} onChange={e => upd({ backgroundColor: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.08)" }} /></div>
              )}
              {config.backgroundType === 'image' && (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F4F5" }}>
                    {config.backgroundImageUrl ? 'Change Image' : 'Upload Image'}
                  </button>
                  {config.backgroundImageUrl && (
                    <div>
                      <label style={labelSt}>Fit</label>
                      <select value={config.backgroundImageFit || 'cover'} onChange={e => upd({ backgroundImageFit: e.target.value as any })} style={inputSt}>
                        <option value="cover" style={{ background: "#121315" }}>Cover</option>
                        <option value="contain" style={{ background: "#121315" }}>Contain</option>
                        <option value="stretch" style={{ background: "#121315" }}>Stretch</option>
                      </select>
                    </div>
                  )}
                </>
              )}
            </AccordionSection>

            {/* Avatar */}
            <AccordionSection title="Avatar" icon={<ImageIcon className="w-3.5 h-3.5" style={{ color: "#1FA7BB" }} />}>
              <div><label style={labelSt}>Size: {config.avatarSize}px</label><input type="range" min="80" max="180" value={config.avatarSize} onChange={e => upd({ avatarSize: +e.target.value })} className="w-full" style={{ accentColor: "#1FA7BB" }} /></div>
              <div><label style={labelSt}>Border: {config.avatarBorderWidth}px</label><input type="range" min="0" max="10" value={config.avatarBorderWidth} onChange={e => upd({ avatarBorderWidth: +e.target.value })} className="w-full" style={{ accentColor: "#1FA7BB" }} /></div>
              <div><label style={labelSt}>Border Color</label><input type="color" value={config.avatarBorderColor} onChange={e => upd({ avatarBorderColor: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.08)" }} /></div>
              <p className="text-[10px]" style={{ color: "#A8A9A2" }}>Drag the avatar on the canvas to reposition it</p>
            </AccordionSection>

            {/* Text Elements */}
            {[
              { key: 'welcome', label: 'Welcome Text', textKey: 'welcomeText', sizeKey: 'welcomeSize', colorKey: 'welcomeColor', fontKey: 'welcomeFont', enabledKey: 'welcomeEnabled', xKey: 'welcomeX', yKey: 'welcomeY' },
              { key: 'username', label: 'Username', textKey: null, sizeKey: 'usernameSize', colorKey: 'usernameColor', fontKey: 'usernameFont', enabledKey: 'usernameEnabled', xKey: 'usernameX', yKey: 'usernameY' },
              { key: 'memberCount', label: 'Member Count', textKey: null, sizeKey: 'memberCountSize', colorKey: 'memberCountColor', fontKey: 'memberCountFont', enabledKey: 'memberCountEnabled', xKey: 'memberCountX', yKey: 'memberCountY' },
              { key: 'serverName', label: 'Server Name', textKey: null, sizeKey: 'serverNameSize', colorKey: 'serverNameColor', fontKey: 'serverNameFont', enabledKey: 'serverNameEnabled', xKey: 'serverNameX', yKey: 'serverNameY' },
            ].map(el => (
              <AccordionSection key={el.key} title={el.label} icon={<Type className="w-3.5 h-3.5" style={{ color: "#1FA7BB" }} />}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px]" style={{ color: "#A8A9A2" }}>Visible</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={(config as any)[el.enabledKey]} onChange={e => upd({ [el.enabledKey]: e.target.checked } as any)} style={{ accentColor: "#1FA7BB" }} />
                  </label>
                </div>
                {(config as any)[el.enabledKey] && (
                  <>
                    {el.textKey && (
                      <div>
                        <label style={labelSt}>Text</label>
                        <input type="text" value={(config as any)[el.textKey]} onChange={e => upd({ [el.textKey!]: e.target.value } as any)} style={inputSt} />
                      </div>
                    )}
                    <div>
                      <label style={labelSt}>Font</label>
                      <select value={(config as any)[el.fontKey]} onChange={e => upd({ [el.fontKey]: e.target.value } as any)} style={inputSt}>
                        {FONTS.map(f => <option key={f} value={f} style={{ background: "#121315" }}>{f}</option>)}
                      </select>
                    </div>
                    <div><label style={labelSt}>Size: {(config as any)[el.sizeKey]}px</label><input type="range" min="14" max="72" value={(config as any)[el.sizeKey]} onChange={e => upd({ [el.sizeKey]: +e.target.value } as any)} className="w-full" style={{ accentColor: "#1FA7BB" }} /></div>
                    <div><label style={labelSt}>Color</label><input type="color" value={(config as any)[el.colorKey]} onChange={e => upd({ [el.colorKey]: e.target.value } as any)} className="w-full h-8 rounded-lg cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.08)" }} /></div>
                    <p className="text-[10px]" style={{ color: "#A8A9A2" }}>Drag on canvas to reposition</p>
                  </>
                )}
              </AccordionSection>
            ))}

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5" style={{ color: "#A8A9A2" }}>
            Cancel
          </button>
          <button onClick={() => onSave(config)} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: "#1FA7BB", color: "#101012" }}>
            <Check className="w-4 h-4" /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
