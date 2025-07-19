"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useSearchUser } from "../../hooks/useSearchUser";


interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon?: React.ReactNode;
}

interface SearchDropdownProps {
  searchValue: string;
  isOpen: boolean;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  searchValue,
  isOpen,
  onClose,
  inputRef,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);


  // Hooks
  const { data, error, isLoading } = useSearchUser(searchValue);
  console.log("Search Data:", data, "Error:", error, "Loading:", isLoading);
  // Sample search data - replace with your actual data source
  const searchData = useMemo(() => [
    {
      id: "1",
      title: "Dashboard",
      description: "Main dashboard overview",
      url: "/dashboard",
      category: "Pages",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
    },
    {
      id: "2",
      title: "Form Elements",
      description: "Input fields, buttons, and form components",
      url: "/forms/form-main",
      category: "Forms",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 3a1 1 0 000 2h10a1 1 0 100-2H5zm0 4a1 1 0 100 2h4a1 1 0 100-2H5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: "3",
      title: "Tables",
      description: "Data tables and table components",
      url: "/tables",
      category: "Components",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: "4",
      title: "Charts",
      description: "Data visualization and charts",
      url: "/charts",
      category: "Components",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      id: "5",
      title: "User Profile",
      description: "User settings and profile management",
      url: "/profile",
      category: "User",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: "6",
      title: "Settings",
      description: "Application settings and preferences",
      url: "/settings",
      category: "System",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ], []);

  // Quick actions/commands
  const quickActions = useMemo(() => [
    {
      id: "action-1",
      title: "Create New Form",
      description: "⌘ + N",
      url: "/forms/new",
      category: "Actions",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: "action-2",
      title: "Toggle Dark Mode",
      description: "⌘ + D",
      url: "#",
      category: "Actions",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ),
    },
    {
      id: "action-3",
      title: "Open Settings",
      description: "⌘ + ,",
      url: "/settings",
      category: "Actions",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ], []);

  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredResults([]);
      setSelectedIndex(-1);
      return;
    }

    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.category.toLowerCase().includes(searchValue.toLowerCase())
    );

    // If no results from main data, show quick actions
    if (filtered.length === 0) {
      const filteredActions = quickActions.filter(
        (action) =>
          action.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          action.description.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredResults(filteredActions);
    } else {
      setFilteredResults(filtered);
    }
    
    setSelectedIndex(-1);
  }, [searchValue, quickActions, searchData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
            // Handle navigation or action
            window.location.href = filteredResults[selectedIndex].url;
          }
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults, onClose, inputRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, inputRef]);

  if (!isOpen) return null;

  const showResults = searchValue.trim().length > 0;
  const showQuickActions = !showResults || filteredResults.length === 0;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto dark:bg-gray-900 dark:border-gray-700"
    >
      {showResults && filteredResults.length > 0 && (
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            Search Results
          </div>
          {filteredResults.map((result, index) => (
            <Link
              key={result.id}
              href={result.url}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                index === selectedIndex
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                {result.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{result.title}</div>
                <div className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {result.description}
                </div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {result.category}
              </div>
            </Link>
          ))}
        </div>
      )}

      {showQuickActions && (
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            {searchValue.trim() ? "Quick Actions" : "Recent"}
          </div>
          {(searchValue.trim() ? quickActions : searchData.slice(0, 4)).map((item, index) => (
            <Link
              key={item.id}
              href={item.url}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                index === selectedIndex
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.title}</div>
                <div className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {item.description}
                </div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {item.category}
              </div>
            </Link>
          ))}
        </div>
      )}

      {showResults && filteredResults.length === 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.485 0-4.735.907-6.47 2.408.364-.215.751-.406 1.157-.571A8 8 0 1120.723 18.33z" />
          </svg>
          <div className="font-medium">No results found</div>
          <div className="text-sm">Try adjusting your search terms</div>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded dark:bg-gray-800 dark:border-gray-700">↑</kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded dark:bg-gray-800 dark:border-gray-700">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded dark:bg-gray-800 dark:border-gray-700">↵</kbd>
              to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded dark:bg-gray-800 dark:border-gray-700">esc</kbd>
              to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
