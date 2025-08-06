import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, Edit3, Check, X, Settings } from "lucide-react";
import { Button } from "./button";
import { Link } from "react-router-dom";
import { getUserCharacter } from "@/lib/character-utils";

interface UserDropdownProps {
  userName: string;
  onUserNameChange: (newName: string) => void;
}

export function UserDropdown({ userName, onUserNameChange }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(userName);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
        setIsEditing(false);
        setEditValue(userName);
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

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== userName) {
      onUserNameChange(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(userName);
    setIsEditing(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          updateDropdownPosition();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <span className="text-white font-medium hidden sm:block drop-shadow-lg">
          {userName}
        </span>
        <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:from-white/30 hover:to-white/20">
          <span className="text-white font-bold text-lg drop-shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
      </button>

      {/* Dropdown Menu - Rendered as Portal */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-4 z-[99999] animate-fade-in"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave();
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 h-7 text-xs"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 px-2 py-1 h-7 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-semibold text-gray-900">{userName}</div>
                  <div className="text-sm text-gray-500">User Profile</div>
                </div>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="w-full justify-start text-left border-gray-200 hover:bg-gray-50"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Name
              </Button>

              <Link to="/settings" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left border-gray-200 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
