import * as React from "react";
import { cn } from "@/lib/utils";

export interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
}

const countryCodes = [
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
];

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, countryCode = "+971", onCountryCodeChange, ...props }, ref) => {
    const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];

    return (
      <div className="flex">
        <div className="relative">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange?.(e.target.value)}
            className="appearance-none bg-light-grey border border-r-0 border-gray-300 rounded-l-md px-3 py-3 pr-8 focus:ring-2 focus:ring-brand-green focus:border-transparent text-sm min-w-[100px]"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <input
          type="tel"
          className={cn(
            "flex-1 px-4 py-3 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-brand-green focus:border-transparent",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
