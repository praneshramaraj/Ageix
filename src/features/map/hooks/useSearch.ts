import { useCallback } from 'react';
import { useMapStore } from '../stores/MapStore';
import { SearchService } from '../services/SearchService';
import { SearchLocationResult } from '../types/map';

export function useSearch(flyTo: (lng: number, lat: number, zoom?: number) => void) {
  const {
    searchQuery,
    searchResults,
    isSearching,
    setSearchQuery,
    setSearchResults,
    setIsSearching,
    setSelectedFeature,
  } = useMapStore();

  const handleQueryChange = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await SearchService.search(query);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    },
    [setSearchQuery, setSearchResults, setIsSearching]
  );

  const selectSearchResult = useCallback(
    (result: SearchLocationResult) => {
      flyTo(result.coordinates[0], result.coordinates[1], result.zoom || 16);
      setSelectedFeature({
        id: result.id,
        name: result.title,
        type: result.category.toUpperCase(),
        category: result.category,
        coordinates: result.coordinates,
        properties: {
          name: result.title,
          subtitle: result.subtitle,
          ...result.properties,
        },
      });
      setSearchResults([]);
    },
    [flyTo, setSelectedFeature, setSearchResults]
  );

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleQueryChange,
    selectSearchResult,
  };
}
