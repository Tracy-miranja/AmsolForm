import { useEffect, useState } from "react";

export default function FlagIcon({ flagPng, flagEmoji, cca2, size = 16 }) {
  const [imgOk, setImgOk] = useState(true);
  const code = (cca2 || "").toLowerCase();
  const cdnWidth = size <= 16 ? 20 : size <= 20 ? 24 : size <= 28 ? 32 : 40;
  const src = flagPng || (code ? `https://flagcdn.com/w${cdnWidth}/${code}.png` : "");

  useEffect(() => { setImgOk(true); }, [src]);

  if (src && imgOk) {
    return (
      <img src={src} alt="" width={size} height={size}
        style={{ borderRadius: 3, objectFit: "cover", display: "block" }}
        onError={() => setImgOk(false)} />
    );
  }
  return <span style={{ fontSize: size }}>{flagEmoji || "🏳️"}</span>;
}
