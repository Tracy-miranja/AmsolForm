import { useRef, useState } from "react";
import { Icon } from "../shared/Icons";
import { GhostBtn, PrimaryBtn } from "../shared/ui";

export default function AvatarModal({ currentUrl, onClose, onSave, saving }) {
  const [preview, setPreview] = useState(currentUrl || null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError("File must be under 5MB."); return; }
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)]">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">Update Profile Photo</h2>
            <p className="text-[#9090a8] text-xs mt-0.5">JPG, PNG or WebP · max 5MB</p>
          </div>
          <button onClick={onClose} className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]">{Icon.x}</button>
        </div>
        <div className="p-6 flex flex-col items-center gap-4">
          <div onClick={() => fileRef.current?.click()}
            className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#e8f1fd] cursor-pointer relative group" style={{ background: "#f4f6fb" }}>
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 60 60" fill="#a0b4d0" width="44" height="44">
                  <circle cx="30" cy="22" r="12" />
                  <path d="M8 52c0-12.15 9.85-22 22-22s22 9.85 22 22" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full">
              <span className="text-white text-xs font-medium flex items-center gap-1">{Icon.camera} Change</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border-[1.5px] border-dashed border-[#1a6edb60] rounded-lg text-[#1a6edb] text-sm font-medium hover:bg-[#e8f1fd] transition">
            {Icon.upload} {file ? file.name : "Choose a photo"}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-[rgba(0,0,0,0.06)] flex justify-end gap-3">
          <GhostBtn onClick={onClose}>{Icon.x} Cancel</GhostBtn>
          <PrimaryBtn onClick={() => onSave(file)} disabled={saving || !file}>
            {saving ? Icon.spin : Icon.save}
            {saving ? "Uploading…" : "Save Photo"}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}
