/**
 *
 * ValueEditor
 *
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/mode-json';

import { Switch } from '@base-ui/react/switch';
import { Slider } from '@base-ui/react/slider';
import Combobox from '../Combobox';
import { isValueTypeMatch } from '../../utils/schemaUtils';

import messages from './messages';
import Form from './Form';
import TextArea from './Textarea';
import Button from './Button';
import Input from './Input';
import EditorWrapper from './EditorWrapper';

function onSelectChange(onChange) {
  return (valueObject) => {
    if (!valueObject) {
      return;
    }

    onChange({
      target: {
        value: valueObject.value,
      },
    });
  };
}
onSelectChange.propTypes = {
  onChange: PropTypes.func.isRequired,
};
function onJsonEditorChange(onChange) {
  return (value) => {
    if (!value) {
      return;
    }
    onChange({
      target: {
        value,
        strValue: value,
      },
    });
  };
}
onJsonEditorChange.propTypes = {
  onChange: PropTypes.func.isRequired,
};

function getSelect(props, options) {
  return (
    <Combobox
      onChange={onSelectChange(props.onChange)}
      value={props.value}
      options={options}
      isClearable={false}
    />
  );
}
getSelect.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};

function JsonAceEditor({ strValue, onChange }) {
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const checkDark = () => {
      const hasDarkAncestor = containerRef.current
        ? Boolean(containerRef.current.closest('.dark'))
        : document.documentElement.classList.contains('dark');
      setIsDark(hasDarkAncestor);
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    const jbsRoot = containerRef.current && containerRef.current.closest('.json-by-schema');
    if (jbsRoot && jbsRoot !== document.documentElement) {
      observer.observe(jbsRoot, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <AceEditor
        mode="json"
        theme={isDark ? 'tomorrow_night' : 'github'}
        name="json-property-editor"
        onChange={onJsonEditorChange(onChange)}
        fontSize={14}
        showPrintMargin
        showGutter
        highlightActiveLine
        value={strValue}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        minLines={25}
        maxLines={120}
        wrapEnabled
        style={{
          width: '100%',
          borderRadius: '10px',
          backgroundColor: isDark ? '#1d1f21' : '#f2f2f7',
        }}
        editorProps={{ $blockScrolling: true }}
      />
    </div>
  );
}

JsonAceEditor.propTypes = {
  strValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

function SetToNullButton({ isNull, onSetNull, className = '' }) {
  return (
    <button
      type="button"
      disabled={isNull}
      onClick={onSetNull}
      className={`px-2.5 py-1 rounded-[var(--jbs-radius)] text-[12px] font-medium transition-opacity flex-shrink-0 ${
        isNull
          ? 'bg-[var(--jbs-input-bg)] text-[var(--jbs-text-muted)] cursor-not-allowed'
          : 'bg-[var(--jbs-accent)] text-[var(--jbs-accent-contrast)] cursor-pointer hover:opacity-90'
      } ${className}`}
    >
      Set to null
    </button>
  );
}

SetToNullButton.propTypes = {
  isNull: PropTypes.bool.isRequired,
  onSetNull: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function getEditor(props) {
  const handleSetNull = () =>
    props.onChange({ target: { value: null, strValue: '' } });
  const isNull = props.value === null;
  const isMismatchedType =
    !isNull &&
    props.value !== undefined &&
    typeof props.type === 'string' &&
    !isValueTypeMatch(props.value, props.type);
  const placeholderValue = isNull
    ? 'null'
    : isMismatchedType
      ? typeof props.value === 'object'
        ? JSON.stringify(props.value)
        : String(props.value)
      : undefined;

  if (props.jsonEditor) {
    return <JsonAceEditor strValue={props.strValue} onChange={props.onChange} />;
  }
  if (props.enum) {
    const options = props.enum.map((value) => ({
      value,
      label: value,
    }));
    if (props.allowsNull) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">{getSelect(props, options)}</div>
          <SetToNullButton isNull={isNull} onSetNull={handleSetNull} />
        </div>
      );
    }
    return getSelect(props, options);
  }
  switch (props.type) {
    case 'boolean': {
      const checked = Boolean(props.value);
      return (
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <Switch.Root
              checked={checked && !isNull && !isMismatchedType}
              onCheckedChange={(nextChecked) =>
                props.onChange({ target: { value: nextChecked } })
              }
              className={`relative inline-flex h-[28px] w-[48px] flex-shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none ${
                checked && !isNull && !isMismatchedType
                  ? 'bg-[var(--jbs-switch-on)]'
                  : 'bg-[var(--jbs-switch-off)]'
              }`}
            >
              <Switch.Thumb
                className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                  checked && !isNull && !isMismatchedType ? 'translate-x-[20px]' : 'translate-x-0'
                }`}
              />
            </Switch.Root>
            <span className="text-[14px] font-medium text-[var(--jbs-text)]">
              {isNull ? 'null' : isMismatchedType ? placeholderValue : checked ? 'True' : 'False'}
            </span>
          </div>
          {props.allowsNull && (
            <SetToNullButton isNull={isNull} onSetNull={handleSetNull} />
          )}
        </div>
      );
    }
    case 'number':
    case 'integer': {
      const isInteger = props.type === 'integer';
      const hasRange =
        typeof props.minimum === 'number' && typeof props.maximum === 'number';
      const numericVal =
        typeof props.value === 'number' && !Number.isNaN(props.value)
          ? props.value
          : props.minimum ?? 0;
      const clampedVal = hasRange
        ? Math.min(props.maximum, Math.max(props.minimum, numericVal))
        : numericVal;
      const sliderStep = isInteger
        ? props.multipleOf || 1
        : props.multipleOf || Number(((props.maximum - props.minimum) / 100).toPrecision(2)) || 0.1;

      return (
        <div className="flex flex-col gap-3">
          <div className="relative flex items-center">
            <Input
              type={'number'}
              placeholder={placeholderValue}
              value={
                isNull || isMismatchedType
                  ? ''
                  : props.strValue !== undefined
                    ? props.strValue
                    : (props.value ?? '')
              }
              onChange={props.onChange}
              step={isInteger ? 1 : 'any'}
              className={props.allowsNull ? 'pr-[96px]' : ''}
            />
            {props.allowsNull && (
              <SetToNullButton
                isNull={isNull}
                onSetNull={handleSetNull}
                className="absolute right-1.5"
              />
            )}
          </div>
          {hasRange && (
            <div className="flex flex-col gap-1.5 px-1">
              <Slider.Root
                min={props.minimum}
                max={props.maximum}
                step={sliderStep}
                value={clampedVal}
                onValueChange={(nextVal) => {
                  const resolved = Array.isArray(nextVal) ? nextVal[0] : nextVal;
                  props.onChange({
                    target: { value: String(resolved), strValue: String(resolved) },
                  });
                }}
              >
                <Slider.Control className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer">
                  <Slider.Track className="bg-[var(--jbs-input-bg)] relative grow rounded-full h-[4px]">
                    <Slider.Indicator className="absolute bg-[var(--jbs-accent)] rounded-full h-full" />
                    <Slider.Thumb
                      aria-label="Numeric value slider"
                      className="block w-5 h-5 bg-white border border-black/10 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--jbs-accent)]/40"
                    />
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>
              <div className="flex justify-between text-[11px] text-[var(--jbs-text-secondary)]">
                <span>{props.minimum}</span>
                <span>{props.maximum}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    case 'null': {
      return (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-[var(--jbs-radius)] bg-[var(--jbs-input-bg)]">
          <span className="text-[14px] font-mono text-[var(--jbs-text)]">
            {isNull ? 'null' : String(props.value)}
          </span>
          <SetToNullButton
            isNull={isNull}
            onSetNull={() =>
              props.onChange({ target: { value: null, strValue: 'null' } })
            }
          />
        </div>
      );
    }
    default: {
      return (
        <div className="relative">
          <TextArea
            className={`scroll-style ${props.allowsNull ? 'pb-10' : ''}`}
            placeholder={placeholderValue}
            value={isNull || isMismatchedType ? '' : (props.value ?? '')}
            onChange={props.onChange}
            rows="10"
          />
          {props.allowsNull && (
            <SetToNullButton
              isNull={isNull}
              onSetNull={handleSetNull}
              className="absolute bottom-2.5 right-2.5"
            />
          )}
        </div>
      );
    }
  }
}

getEditor.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]),
  strValue: PropTypes.string,
  enum: PropTypes.array,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  allowsNull: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  jsonEditor: PropTypes.bool,
};

function ValueEditor(props) {
  return (
    <Form onSubmit={props.onSubmit} onKeyDown={props.onKeyDown}>
      <EditorWrapper>{getEditor(props)}</EditorWrapper>
      <div>
        <Button
          type="button"
          disabled={props.disableButtons.revert}
          value={props.intl.formatMessage(messages.revert)}
          style={{ paddingLeft: 0 }}
          className={'text-button'}
          onClick={props.onRevert}
        />
        <Button
          type="submit"
          disabled={props.disableButtons.submit}
          value={props.intl.formatMessage(messages.save)}
          style={{ float: 'right', paddingRight: 0 }}
          className={'text-button'}
        />
      </div>
    </Form>
  );
}

ValueEditor.propTypes = {
  disableButtons: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onRevert: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  allowsNull: PropTypes.bool,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  value: PropTypes.any,
};

export default injectIntl(ValueEditor);
