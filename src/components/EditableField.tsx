import React, { useState, useRef, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  expandedByDefault?: boolean;
  className?: string;
}

export function EditableField({ 
  value, 
  onChange, 
  multiline = false, 
  expandedByDefault = true,
  className = ''
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline && 'selectionStart' in inputRef.current) {
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
      }
    }
  }, [isEditing, multiline]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      setIsEditing(false);
      if (localValue !== value) {
        onChange(localValue);
      }
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalValue(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const commonStyles = `
    w-full
    rounded-lg
    transition-all
    duration-200
    ${isEditing ? 'bg-white/10 border-2 border-white/20' : 'bg-transparent border-2 border-transparent'}
    ${!isEditing && 'hover:bg-white/5'}
    focus:outline-none
    focus:ring-0
    p-3
    leading-relaxed
    ${className}
  `;

  if (multiline) {
    const rows = Math.max(3, localValue.split('\n').length);
    const minHeight = expandedByDefault ? `${rows * 1.5}em` : 'auto';

    return (
      <div 
        className="relative group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          className={`${commonStyles} scrollbar-slim`}
          style={{
            minHeight,
            height: 'auto',
            resize: 'vertical',
            overflow: 'auto',
          }}
          rows={rows}
        />
        {!isEditing && showTooltip && localValue.length > 100 && (
          <div 
            ref={tooltipRef}
            className="absolute z-50 max-w-lg bg-gray-900 text-white text-sm rounded-lg px-4 py-2 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            {localValue}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className={commonStyles}
      />
      {!isEditing && showTooltip && localValue.length > 30 && (
        <div 
          ref={tooltipRef}
          className="absolute z-50 max-w-xs bg-gray-900 text-white text-sm rounded-lg px-4 py-2 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {localValue}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
        </div>
      )}
    </div>
  );
}