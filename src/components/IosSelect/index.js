import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function IosSelect({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  isClearable = false,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const filteredOptions = query
    ? options.filter((opt) =>
        String(opt.label).toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      const idx = selectedOption
        ? filteredOptions.findIndex((o) => o.value === selectedOption.value)
        : 0;
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [open, query]);

  const selectOption = (option) => {
    setOpen(false);
    setQuery('');
    if (onChange) {
      onChange(option);
    }
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      e.preventDefault();
      setOpen(true);
      return;
    }

    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filteredOptions.length ? (prev + 1) % filteredOptions.length : 0,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filteredOptions.length
          ? (prev - 1 + filteredOptions.length) % filteredOptions.length
          : 0,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        selectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        onClick={() => {
          setOpen(true);
          if (inputRef.current) inputRef.current.focus();
        }}
        className="flex items-center justify-between w-full px-3 py-1.5 rounded-[10px] text-[14px] bg-[#767680]/15 dark:bg-[#767680]/25 text-black dark:text-white cursor-text"
      >
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          value={open ? query : selectedOption ? String(selectedOption.label) : ''}
          placeholder={selectedOption ? String(selectedOption.label) : placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none text-[14px] text-black dark:text-white placeholder:text-[#3c3c43]/60 dark:placeholder:text-[#ebebf5]/50"
        />

        <div className="flex items-center gap-1 ml-1.5 flex-shrink-0">
          {isClearable && selectedOption && (
            <button
              type="button"
              aria-label="Clear selection"
              onClick={(e) => {
                e.stopPropagation();
                setQuery('');
                setOpen(false);
                if (onChange) onChange(null);
              }}
              className="p-0.5 text-[#8e8e93] hover:text-black dark:hover:text-white cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Toggle options"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
              if (!open && inputRef.current) inputRef.current.focus();
            }}
            className="p-0.5 text-[#8e8e93] cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto p-1 rounded-xl bg-white/95 dark:bg-[#2c2c2e]/95 backdrop-blur-md border border-[#c6c6c8]/60 dark:border-[#38383a] shadow-lg list-none m-0"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-[13px] text-[#8e8e93] text-center">
              No matching options
            </li>
          ) : (
            filteredOptions.map((opt, idx) => {
              const isSelected = selectedOption && opt.value === selectedOption.value;
              const isHighlighted = idx === highlightedIndex;
              return (
                <li
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectOption(opt);
                  }}
                  className={`relative flex items-center px-7 py-2 rounded-lg text-[14px] cursor-pointer select-none ${
                    isHighlighted
                      ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white'
                      : 'text-black dark:text-white'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-2 inline-flex items-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                  <span>{String(opt.label)}</span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

IosSelect.propTypes = {
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.node.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  isClearable: PropTypes.bool,
  className: PropTypes.string,
};

export default IosSelect;
