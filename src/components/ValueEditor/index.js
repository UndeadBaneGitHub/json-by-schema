/**
 *
 * ValueEditor
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/mode-json';

import Select from 'react-select';

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
  const selectedOption = options.find((opt) => opt.value === props.value) || null;
  return (
    <Select
      onChange={onSelectChange(props.onChange)}
      value={selectedOption}
      options={options}
      isClearable={false}
      styles={{
        control: (base) => ({
          ...base,
          cursor: 'pointer',
          width: '100%',
          backgroundColor: 'var(--jbs-input-bg)',
          borderColor: 'transparent',
          borderRadius: '10px',
          boxShadow: 'none',
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: 'var(--jbs-bg)',
          border: '1px solid var(--jbs-border)',
          borderRadius: '10px',
          overflow: 'hidden',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? 'var(--jbs-accent)'
            : state.isFocused
              ? 'var(--jbs-bg-secondary)'
              : 'transparent',
          color: state.isSelected ? '#ffffff' : 'var(--jbs-text)',
          cursor: 'pointer',
        }),
        singleValue: (base) => ({
          ...base,
          color: 'var(--jbs-text)',
        }),
        input: (base) => ({
          ...base,
          color: 'var(--jbs-text)',
        }),
      }}
      onKeyDown={props.onKeyDown}
      autoFocus
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

function getEditor(props) {
  if (props.jsonEditor) {
    const isDark =
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark');
    return (
      <AceEditor
        mode="json"
        theme={isDark ? 'tomorrow_night' : 'github'}
        name="json-property-editor"
        onChange={onJsonEditorChange(props.onChange)}
        fontSize={16}
        showPrintMargin
        showGutter
        highlightActiveLine
        value={props.strValue}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        minLines={25}
        maxLines={120}
        wrapEnabled
        style={{
          width: '100%',
          borderRadius: '6px',
          backgroundColor: '#dddce1',
        }}
        editorProps={{ $blockScrolling: true }}
      />
    );
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
      return getSelect(props, [
        {
          value: true,
          label: 'True',
        },
        {
          value: false,
          label: 'False',
        },
      ]);
    }
    case 'number': {
      return (
        <Input
          type={'number'}
          value={props.strValue !== undefined ? props.strValue : (props.value ?? '')}
          onChange={props.onChange}
          step={'any'}
        />
      );
    }
    case 'integer': {
      return (
        <Input
          type={'number'}
          value={props.strValue !== undefined ? props.strValue : (props.value ?? '')}
          onChange={props.onChange}
          step={1}
        />
      );
    }
    default: {
      return (
        <TextArea
          className={'scroll-style'}
          value={props.value}
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
  ]).isRequired,
  strValue: PropTypes.string,
  enum: PropTypes.array,
  type: PropTypes.string.isRequired,
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
