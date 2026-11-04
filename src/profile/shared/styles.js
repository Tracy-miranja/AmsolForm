// Page-level CSS, moved verbatim out of the old component.
// NOTE: kept as a plain template literal on purpose (same as before) so rendering is unchanged.
const profileCss = `
 @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --canvas:    #F7F8FA;
  --surface:   #FFFFFF;
  --border:    rgba(0,0,0,0.07);
  --border-md: rgba(0,0,0,0.11);
  --accent:    #1a6edb;
  --accent-lt: #EBF2FF;
  --text-1:    #0F1523;
  --text-2:    #4A5068;
  --text-3:    #9098B1;
  --orange:    #f26722;
  --green:     #16a34a;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05);
}

body {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--canvas);
  color: var(--text-1);
  -webkit-font-smoothing: antialiased;
}

@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:.45; } }

.fade-in { animation: fadeUp 0.28s cubic-bezier(.22,.68,0,1.2) both; }

.group:hover .group-hover\:opacity-100 { opacity: 1 !important; }

input[type="date"] { color-scheme: light; }
input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }

.main-layout {
  display: grid;
  grid-template-columns: 256px 1fr;
  min-height: 100vh;
  background: var(--canvas);
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 0;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.sidebar-overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(15,21,35,0.5);
  backdrop-filter: blur(2px);
  z-index: 40;
}
.sidebar-overlay.open { display: block; }

.bottom-nav {
  display: none;
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
  z-index: 30;
  padding: 6px 0 max(8px, env(safe-area-inset-bottom));
}

.main-content { overflow-y: auto; min-height: 100vh; }

.page-padding { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }

.profile-grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.bg-white.rounded-\[14px\] {
  background: var(--surface) !important;
  border-radius: var(--radius-md) !important;
  border: 1px solid var(--border) !important;
  box-shadow: var(--shadow-sm) !important;
  transition: box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}
.bg-white.rounded-\[14px\]:hover { box-shadow: var(--shadow-md) !important; }

.bg-white.rounded-\[14px\] > div:first-child {
  background: var(--surface);
  border-bottom: 1px solid var(--border) !important;
  padding: 16px 22px !important;
}

.bg-white.rounded-\[14px\] > div:last-child { padding: 22px !important; }

.completion-card {
  background: linear-gradient(135deg, #0F1523 0%, #1a3a6e 100%) !important;
  border-radius: var(--radius-lg) !important;
  border: none !important;
  padding: 24px 28px !important;
  display: flex !important;
  align-items: center !important;
  gap: 28px !important;
  box-shadow: 0 8px 32px rgba(26,110,219,0.25) !important;
  color: #fff;
}
.completion-card * { color: inherit; }
.completion-card > div:first-child > div:first-child {
  font-size: 14px !important; font-weight: 600 !important;
  color: rgba(255,255,255,0.95) !important;
}
.completion-card > div:first-child > div:last-child {
  font-size: 12px !important;
  color: rgba(255,255,255,0.55) !important;
  margin-top: 2px;
}

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15,21,35,0.6);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 50; padding: 16px;
}
.modal-sheet {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border);
  animation: fadeUp 0.22s cubic-bezier(.22,.68,0,1.1) both;
}

.main-content > div:first-child {
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
  padding: 0 24px !important;
  height: 64px !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 10 !important;
  box-shadow: 0 1px 0 var(--border) !important;
}

button.flex.items-center.gap-2\.5.w-full {
  border-radius: var(--radius-sm) !important;
  font-size: 13.5px !important;
  padding: 9px 12px !important;
  transition: background 0.15s, color 0.15s !important;
  position: relative;
}
button.flex.items-center.gap-2\.5.w-full.bg-\[\#e8f1fd\] {
  background: var(--accent-lt) !important;
  color: var(--accent) !important;
  font-weight: 600 !important;
}
button.flex.items-center.gap-2\.5.w-full.bg-\[\#e8f1fd\]::before {
  content: '';
  position: absolute;
  left: 0; top: 20%; bottom: 20%;
  width: 3px;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
}

input:not([type="radio"]):not([type="checkbox"]):not([type="file"]),
select,
textarea {
  background: #F7F8FA !important;
  border: 1.5px solid #E2E5EE !important;
  border-radius: var(--radius-sm) !important;
  font-size: 13.5px !important;
  color: var(--text-1) !important;
  padding: 9px 12px !important;
  transition: border-color 0.15s, box-shadow 0.15s !important;
  outline: none !important;
  width: 100%;
}
input:not([type="radio"]):not([type="checkbox"]):not([type="file"]):focus,
select:focus {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 3px rgba(26,110,219,0.12) !important;
  background: #fff !important;
}

button.flex.items-center.gap-1\.5.px-3.py-1\.5.rounded-lg.border {
  border: 1.5px solid #E2E5EE !important;
  border-radius: var(--radius-sm) !important;
  font-size: 12.5px !important;
  color: var(--text-2) !important;
  background: #fff !important;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s !important;
  font-weight: 500 !important;
}
button.flex.items-center.gap-1\.5.px-3.py-1\.5.rounded-lg.border:hover {
  background: var(--canvas) !important;
  border-color: #c8cdd8 !important;
}

button.flex.items-center.gap-1\.5.px-3.py-1\.5.rounded-lg.bg-\[\#1a6edb\] {
  background: var(--accent) !important;
  border-radius: var(--radius-sm) !important;
  font-size: 12.5px !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 8px rgba(26,110,219,0.3) !important;
  transition: background 0.15s, box-shadow 0.15s !important;
}
button.flex.items-center.gap-1\.5.px-3.py-1\.5.rounded-lg.bg-\[\#1a6edb\]:hover {
  background: #155bba !important;
  box-shadow: 0 4px 14px rgba(26,110,219,0.4) !important;
}

button.flex.items-center.gap-1\.5.px-3\.5.py-1\.5 {
  border: 1.5px dashed rgba(26,110,219,0.4) !important;
  border-radius: var(--radius-sm) !important;
  color: var(--accent) !important;
  font-size: 12.5px !important;
  font-weight: 500 !important;
  transition: background 0.15s !important;
}
button.flex.items-center.gap-1\.5.px-3\.5.py-1\.5:hover { background: var(--accent-lt) !important; }

.top-bar-btn {
  border-radius: var(--radius-sm) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 8px 16px !important;
  transition: background 0.15s, box-shadow 0.15s !important;
}

span.flex.items-center.gap-1\.5.px-3.py-1\.5.rounded-full {
  background: #F0F2F8 !important;
  border: 1.5px solid #E2E5EE !important;
  border-radius: 99px !important;
  font-size: 12.5px !important;
  color: var(--text-2) !important;
  font-weight: 500 !important;
}

.personal-info-inner { display: flex; gap: 28px; align-items: flex-start; }
.personal-info-fields { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; }

.personal-info-inner > div:first-child > div:first-child {
  border-radius: 18px !important;
  border: 3px solid var(--accent-lt) !important;
  box-shadow: 0 0 0 1px rgba(26,110,219,0.15) !important;
}

.sidebar > div:first-child {
  padding: 24px 20px 20px !important;
  border-bottom: 1px solid var(--border) !important;
}
.sidebar > div:last-child {
  padding: 16px 20px !important;
  border-top: 1px solid var(--border) !important;
  background: #FAFBFC;
}

.bg-\[\#ede9fe\] { background: #EDE9FE !important; }
.bg-\[\#f4f6fb\] { background: #F0F2F8 !important; }

.p-4.bg-\[\#f8f9fc\].rounded-xl {
  background: #F7F8FA !important;
  border: 1.5px solid #E8EBF2 !important;
  border-radius: 12px !important;
}

::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #D1D5E0; border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: #9098B1; }

@media (max-width: 768px) {
  .main-layout { grid-template-columns: 1fr; }
  .main-content { padding-bottom: 72px; }
  .page-padding { padding: 16px !important; }
  .profile-grid-2col { grid-template-columns: 1fr !important; }
  .completion-card { flex-direction: column !important; gap: 14px !important; }
  .bottom-nav { display: flex; justify-content: space-around; align-items: center; }
  .sidebar-overlay.open { display: block; }
   .sidebar {
    position: fixed !important;
    top: 0;
    left: 0;
    height: 100vh;
    width: 260px;
    max-width: 80vw;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 8px 0 24px rgba(0,0,0,0.15);
  }
  .sidebar.open { transform: translateX(0); }
  .modal-sheet {
    max-width: 100% !important;
    max-height: 92vh !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  .modal-overlay { align-items: flex-end !important; padding: 0 !important; }
  .personal-info-inner { flex-direction: column !important; align-items: center !important; }
  .personal-info-fields { grid-template-columns: 1fr !important; }
}
@media (max-width: 480px) {
  .top-bar-label { display: none; }
  .top-bar-btn { padding: 8px 10px !important; }
}
@media (min-width: 769px) {
  .sidebar {
    position: sticky !important;
    top: 0 !important;
    transform: translateX(0) !important;
    flex-shrink: 0 !important;
  }
  .bottom-nav { display: none !important; }
  .sidebar-overlay { display: none !important; }
  .hamburger-btn { display: none !important; }
}
`;

export default profileCss;
