import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';

function Combobox({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  isClearable = false,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <BaseCombobox.Root
        items={options}
        value={selectedOption}
        open={open}
        onOpenChange={(nextOpen) => setOpen(nextOpen)}
        onValueChange={(nextOption) => {
          if (onChange) {
            onChange(nextOption || null);
          }
        }}
        itemToStringLabel={(opt) => (opt ? String(opt.label) : '')}
        itemToStringValue={(opt) => (opt ? String(opt.value) : '')}
        isItemEqualToValue={(a, b) => Boolean(a && b && a.value === b.value)}
      >
        <div
          onClick={() => setOpen(true)}
          className="flex items-center justify-between w-full px-3 py-1.5 rounded-[var(--jbs-radius)] text-[14px] bg-[var(--jbs-input-bg)] text-[var(--jbs-text)] cursor-text"
        >
          <BaseCombobox.Input
            placeholder={selectedOption ? String(selectedOption.label) : placeholder}
            onFocus={() => setOpen(true)}
            className="w-full bg-transparent outline-none text-[14px] text-[var(--jbs-text)] placeholder:text-[var(--jbs-text-secondary)]"
          />

          <div className="flex items-center gap-1 ml-1.5 flex-shrink-0">
            {isClearable && selectedOption && (
              <BaseCombobox.Clear
                aria-label="Clear selection"
                className="p-0.5 text-[var(--jbs-text-muted)] hover:text-[var(--jbs-text)] cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </BaseCombobox.Clear>
            )}
            <BaseCombobox.Trigger
              tabIndex={-1}
              aria-label="Toggle options"
              className="p-0.5 text-[var(--jbs-text-muted)] cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </BaseCombobox.Trigger>
          </div>
        </div>

        <BaseCombobox.Portal container={containerRef}>
          <BaseCombobox.Positioner sideOffset={4} className="z-50 w-[var(--anchor-width)]">
            <BaseCombobox.Popup className="max-h-60 overflow-y-auto p-1 rounded-[var(--jbs-radius-lg)] bg-[var(--jbs-popover-bg)] backdrop-blur-md border border-[var(--jbs-border)] shadow-lg outline-none">
              <BaseCombobox.Empty className="px-3 py-2 text-[13px] text-[var(--jbs-text-muted)] text-center empty:hidden">
                No matching options
              </BaseCombobox.Empty>
              <BaseCombobox.List>
                {(opt) => {
                  const isDisabled = Boolean(opt.disabled);
                  return (
                    <BaseCombobox.Item
                      key={String(opt.value)}
                      value={opt}
                      disabled={isDisabled}
                      className="relative flex items-center px-7 py-2 rounded-[var(--jbs-radius)] text-[14px] select-none text-[var(--jbs-text)] cursor-pointer data-[highlighted]:bg-[var(--jbs-accent)] data-[highlighted]:text-[var(--jbs-accent-contrast)] data-[disabled]:text-[var(--jbs-text-muted)] data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                    >
                      <BaseCombobox.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </BaseCombobox.ItemIndicator>
                      <span>{String(opt.label)}</span>
                    </BaseCombobox.Item>
                  );
                }}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
    </div>
  );
}

Combobox.propTypes = {
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.node.isRequired,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  isClearable: PropTypes.bool,
  className: PropTypes.string,
};

export default Combobox;
