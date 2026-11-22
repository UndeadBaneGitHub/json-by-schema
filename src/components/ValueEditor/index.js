/**
 *
 * ValueEditor
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/mode-json';

import * as Switch from '@radix-ui/react-switch';
import * as Slider from '@radix-ui/react-slider';
import IosSelect from '../IosSelect';

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
    <IosSelect
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
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return (
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
  );
}

JsonAceEditor.propTypes = {
  strValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

function getEditor(props) {
  if (props.jsonEditor) {
    return <JsonAceEditor strValue={props.strValue} onChange={props.onChange} />;
  }
  if (props.enum) {
    const options = props.enum.map((value) => ({
      value,
      label: value,
    }));
    return getSelect(props, options);
  }
  switch (props.type) {
    case 'boolean': {
      const checked = Boolean(props.value);
      return (
        <div className="flex items-center gap-3 py-1">
          <Switch.Root
            checked={checked}
            onCheckedChange={(nextChecked) =>
              props.onChange({ target: { value: nextChecked } })
            }
            className={`relative inline-flex h-[28px] w-[48px] flex-shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none ${
              checked ? 'bg-[#34c759]' : 'bg-[#e9e9ea] dark:bg-[#39393d]'
            }`}
          >
            <Switch.Thumb
              className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                checked ? 'translate-x-[20px]' : 'translate-x-0'
              }`}
            />
          </Switch.Root>
          <span className="text-[14px] font-medium text-black dark:text-white">
            {checked ? 'True' : 'False'}
          </span>
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
          <Input
            type={'number'}
            value={props.strValue !== undefined ? props.strValue : (props.value ?? '')}
            onChange={props.onChange}
            step={isInteger ? 1 : 'any'}
          />
          {hasRange && (
            <div className="flex flex-col gap-1.5 px-1">
              <Slider.Root
                min={props.minimum}
                max={props.maximum}
                step={sliderStep}
                value={[clampedVal]}
                onValueChange={([nextVal]) =>
                  props.onChange({
                    target: { value: String(nextVal), strValue: String(nextVal) },
                  })
                }
                className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
              >
                <Slider.Track className="bg-[#767680]/20 dark:bg-[#767680]/35 relative grow rounded-full h-[4px]">
                  <Slider.Range className="absolute bg-[#007aff] dark:bg-[#0a84ff] rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                  aria-label="Numeric value slider"
                  className="block w-5 h-5 bg-white border border-black/10 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#007aff]/40"
                />
              </Slider.Root>
              <div className="flex justify-between text-[11px] text-[#3c3c43]/60 dark:text-[#ebebf5]/50">
                <span>{props.minimum}</span>
                <span>{props.maximum}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    case 'null': {
      const isNull = props.value === null;
      return (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#767680]/15 dark:bg-[#767680]/25">
          <span className="text-[14px] font-mono text-black dark:text-white">
            {isNull ? 'null' : String(props.value)}
          </span>
          <button
            type="button"
            disabled={isNull}
            onClick={() =>
              props.onChange({ target: { value: null, strValue: 'null' } })
            }
            className={`px-3 py-1 rounded-lg text-[13px] font-medium transition-opacity ${
              isNull
                ? 'bg-[#8e8e93]/20 text-[#8e8e93] cursor-not-allowed'
                : 'bg-[#007aff] dark:bg-[#0a84ff] text-white cursor-pointer hover:opacity-90'
            }`}
          >
            Set to null
          </button>
        </div>
      );
    }
    default: {
      return (
        <TextArea
          className={'scroll-style'}
          value={props.value ?? ''}
          onChange={props.onChange}
          rows="10"
        />
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
};

export default injectIntl(ValueEditor);
