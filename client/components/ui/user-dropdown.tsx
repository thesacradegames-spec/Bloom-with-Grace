import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, Settings } from "lucide-react";
import { Button } from "./button";
import { Link } from "react-router-dom";
import { getUserCharacter } from "@/lib/character-utils";

interface UserDropdownProps {
  userName: string;
}

export function UserDropdown({ userName }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userCharacter, setUserCharacter] = useState(() => getUserCharacter());
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update character only when userName changes, not when dropdown opens
  useEffect(() => {
    setUserCharacter(getUserCharacter());
  }, [userName]);

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) updateDropdownPosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [userName, isOpen]);


  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          updateDropdownPosition();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-3 hover:opacity-80 transition-all duration-300"
      >
        <div className={`w-12 h-12 bg-gradient-to-br ${userCharacter.color} backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-pulse`}>
          <span className="text-2xl drop-shadow-lg">
            {userCharacter.emoji}
          </span>
        </div>
      </button>

      {/* Dropdown Menu - Rendered as Portal */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-56 sm:w-64 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 p-3 sm:p-4 z-[99999] animate-fade-in"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${userCharacter.color} rounded-full flex items-center justify-center border border-gray-200 shadow-sm`}>
              <span className="text-lg sm:text-xl">{userCharacter.emoji}</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm sm:text-base">{userName}</div>
              <div className="text-xs sm:text-sm text-gray-500">User Profile</div>
            </div>
          </div>

          <div className="space-y-2">
            <Link to="/settings" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left border-gray-200 hover:bg-gray-50 text-sm"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
