import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { JsonBySchema } from '../../index';

describe('type array nullable switch', () => {
  it('allows creating x-kappa, setting KAPPA, setting null, switching away, returning, seeing null, and switching to integer', async () => {
    Element.prototype.scrollIntoView = () => {};

    const schema = {
      type: 'object',
      properties: {
        other: { type: 'string' },
      },
      patternProperties: {
        '^x-': {
          type: ['string', 'integer', 'null'],
        },
      },
    };
    const config = {
      other: 'abc',
    };

    render(<JsonBySchema schema={schema} config={config} />);

    // 1. Click "+ Add Item" to open NewPatternPropertyItem
    const addBtn = await screen.findByText('Add Item', {}, { timeout: 10000 });
    fireEvent.click(addBtn);

    // 2. Type "x-kappa" and Save
    const nameInput = await screen.findByPlaceholderText(/property name/i);
    fireEvent.change(nameInput, { target: { value: 'x-kappa' } });
    const saveNewBtn = await screen.findByDisplayValue('Save');
    fireEvent.click(saveNewBtn);

    // 3. Pick "string" from One of dropdown
    const combobox1 = await screen.findByRole('combobox', {}, { timeout: 5000 });
    fireEvent.focus(combobox1);
    const stringOpt = await screen.findByRole('option', { name: 'string' });
    fireEvent.mouseDown(stringOpt);

    // Set value to "KAPPA" and Save
    await waitFor(() => {
      expect(document.querySelectorAll('textarea').length).toBe(1);
    }, { timeout: 5000 });
    const textareas = document.querySelectorAll('textarea');
    fireEvent.change(textareas[0], { target: { value: 'KAPPA' } });
    const saveValBtn = await screen.findByDisplayValue('Save');
    fireEvent.click(saveValBtn);

    // 4. Click "Set to null" and Save
    const setNullBtn = await screen.findByText('Set to null');
    fireEvent.click(setNullBtn);
    const saveNullBtn = await screen.findByDisplayValue('Save');
    fireEvent.click(saveNullBtn);

    // 5. Pick "other"
    const otherItems = await screen.findAllByText('other');
    fireEvent.click(otherItems[0]);

    // 6. Click "x-kappa" again
    await waitFor(() => {
      expect(document.querySelectorAll('textarea').length).toBe(1);
    });
    const kappaItems = await screen.findAllByText('x-kappa');
    fireEvent.click(kappaItems[0]);

    // Verify null placeholder is displayed
    await waitFor(() => {
      const ta = document.querySelector('textarea');
      expect(ta).toBeTruthy();
      expect(ta.getAttribute('placeholder')).toBe('null');
    }, { timeout: 5000 });

    // Pick "integer" from One of dropdown
    const combobox2 = await screen.findByRole('combobox');
    fireEvent.focus(combobox2);
    const integerOpt = await screen.findByRole('option', { name: 'integer' });
    fireEvent.mouseDown(integerOpt);

    // PropertyEditor should now show number input
    await waitFor(() => {
      expect(screen.getByRole('spinbutton')).toBeTruthy();
    }, { timeout: 5000 });

    // Set integer value to 123 and Save
    const numInput = screen.getByRole('spinbutton');
    fireEvent.change(numInput, { target: { value: '123' } });
    const saveIntBtn = await screen.findByDisplayValue('Save');
    fireEvent.click(saveIntBtn);

    // Switch back to "string"
    const combobox3 = await screen.findByRole('combobox');
    fireEvent.focus(combobox3);
    const stringOpt2 = await screen.findByRole('option', { name: 'string' });
    fireEvent.mouseDown(stringOpt2);

    // String editor should show 123 as placeholder, empty value, and no validation error
    await waitFor(() => {
      const ta = document.querySelector('textarea');
      expect(ta).toBeTruthy();
      expect(ta.value).toBe('');
      expect(ta.getAttribute('placeholder')).toBe('123');
      expect(document.body.textContent).not.toContain('is not of a type');
    }, { timeout: 5000 });
  }, 20000);
});
