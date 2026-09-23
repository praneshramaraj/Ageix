import React from 'react';
import { Search } from 'lucide-react';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Search records...', ...props }) => {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#00D4FF]" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#07161E] border border-[#1E3440] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#6C7A89] focus:outline-none focus:border-[#00D4FF] transition-colors font-sans"
        {...props}
      />
    </div>
  );
};
