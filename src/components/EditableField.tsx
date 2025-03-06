import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

export function EditableField({ value, onChange, multiline = false }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipTimeout = useRef<NodeJS.Timeout>();
  const expandedRef = useRef<HTMLDivElement>(null);

  const commonClasses = `
    w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-[#303845] rounded p-1
    ${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}
    transition-colors duration-200
  `;

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (!isExpanded) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      setIsEditing(false);
    }
  };

  const handleMouseEnter = () => {
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
    tooltipTimeout.current = setTimeout(() => {
      if (contentRef.current) {
        const element = contentRef.current;
        const shouldShowTooltip = element.scrollWidth > element.clientWidth || 
                                (element.scrollHeight > element.clientHeight && !isEditing);
        
        if (shouldShowTooltip && !isExpanded) {
          setShowTooltip(true);
          updateTooltipPosition();
        }
      }
    }, 200);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
    setShowTooltip(false);
  };

  const updateTooltipPosition = () => {
    if (!contentRef.current || !tooltipRef.current) return;

    const element = contentRef.current;
    const tooltip = tooltipRef.current;
    const rect = element.getBoundingClientRect();
    
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceRight = viewportWidth - rect.left;
    
    let top, left;
    
    if (spaceBelow >= tooltip.offsetHeight || spaceBelow > spaceAbove) {
      top = rect.bottom + 5;
    } else {
      top = rect.top - tooltip.offsetHeight - 5;
    }
    
    if (spaceRight >= tooltip.offsetWidth) {
      left = rect.left;
    } else {
      left = viewportWidth - tooltip.offsetWidth - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setShowTooltip(false);
    if (!isExpanded) {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expandedRef.current && !expandedRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsEditing(false);
      }
    };

    const handleScroll = () => {
      if (showTooltip) {
        setShowTooltip(false);
      }
    };

    const handleResize = () => {
      if (showTooltip) {
        updateTooltipPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, [showTooltip]);

  if (isExpanded) {
    return (
      <div 
        ref={expandedRef}
        className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[calc(100vw-2rem)]"
      >
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium text-gray-700">Editor de Texto</h3>
          <button
            onClick={toggleExpand}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Minimize2 size={20} />
          </button>
        </div>
        <div className="p-4">
          <textarea
            className="w-full min-h-[200px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303845]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full group" 
      ref={contentRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {multiline ? (
        <div className="relative">
          <textarea
            className={`${commonClasses} min-h-[100px] resize-none`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              height: isEditing ? '200px' : 'auto',
              overflow: isEditing ? 'auto' : 'hidden'
            }}
          />
          <button
            onClick={toggleExpand}
            className="absolute top-1 right-1 p-1 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            className={`${commonClasses} truncate pr-7`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={toggleExpand}
            className="absolute top-1 right-1 p-1 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      )}

      {showTooltip && !isEditing && value && !isExpanded && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg max-w-sm"
          style={{
            maxWidth: '400px',
            wordBreak: 'break-word'
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}