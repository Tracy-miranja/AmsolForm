import { useState } from "react";
import * as countryCodes from "country-codes-list";

export default function useCountries() {
  const [countries] = useState(() =>
    countryCodes
      .all()
      .map((c) => ({
        name: c.countryNameEn,
        cca2: c.countryCode,
        flag: "",
        flagPng: `https://flagcdn.com/w20/${c.countryCode.toLowerCase()}.png`,
        dialCode: `+${c.countryCallingCode}`,
        capital: "",
        region: "",
      }))
      .filter((c) => c.dialCode && c.dialCode !== "+")
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
  return { countries, loading: false };
}
