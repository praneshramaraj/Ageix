import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Building2, Cross, Home, Shield, Flame, GraduationCap, Plane } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';

interface SearchBarProps {
  onFlyTo: (lng: number, lat: number, zoom?: number) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onFlyTo }) => {
  const { searchQuery, searchResults, isSearching, handleQueryChange, selectSearchResult } = useSearch(onFlyTo);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hospital':
        return <Cross className="w-4 h-4 text-[#FF4B55]" />;
      case 'shelter':
        return <Home className="w-4 h-4 text-[#3DDC84]" />;
      case 'police':
        return <Shield className="w-4 h-4 text-[#3182ce]" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-[#FF4B55]" />;
      case 'school':
        return <GraduationCap className="w-4 h-4 text-[#FFB000]" />;
      case 'airport':
        return <Plane className="w-4 h-4 text-[#00D4FF]" />;
      default:
        return <Building2 className="w-4 h-4 text-[#00D4FF]" />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md pointer-events-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-[#00D4FF]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            handleQueryChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city, district, hospital, shelter, coordinates..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#10232C]/90 backdrop-blur-md border border-[#1E3440] text-xs font-semibold text-white placeholder-[#AAB6C3] focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all shadow-xl"
        />
        {searchQuery && (
          <button
            onClick={() => {
              handleQueryChange('');
              setIsOpen(false);
            }}
            className="absolute right-3 p-1 rounded-lg text-[#AAB6C3] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-12 left-0 right-0 p-2 rounded-2xl map-glass-panel border border-[#1E3440] shadow-2xl space-y-1 z-50 animate-in fade-in slide-in-from-top-2 max-h-80 overflow-y-auto">
          <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
            Spatial Search Matches ({searchResults.length})
          </div>
          {searchResults.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                selectSearchResult(item);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1E3440] text-left transition-all border border-transparent hover:border-[#00D4FF]/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#07161E] border border-[#1E3440] group-hover:border-[#00D4FF]/40">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-[#AAB6C3] truncate">{item.subtitle}</div>
                </div>
              </div>
              <MapPin className="w-4 h-4 text-[#AAB6C3] group-hover:text-[#00D4FF] transition-colors shrink-0" />
            </button>
          ))}
        </div>
      )}

      {isOpen && searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="absolute top-12 left-0 right-0 p-4 rounded-2xl map-glass-panel border border-[#1E3440] text-center z-50">
          <p className="text-xs text-[#AAB6C3]">No spatial match found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};
