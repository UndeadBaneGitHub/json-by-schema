/**
 *
 * SchemaSelectorsStack
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ImmutableProptypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getSchemaByIndex, isMultipleChoiceSchema } from '../../utils/schemaUtils';
import SchemaSelector from '../../components/SchemaSelector';

import Wrapper from './Wrapper';

export class SchemaSelectorsStack extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.genOnChange = (index) => {
      const self = this;

      return (value) => {
        const { schemaIndexes } = self.props;

        let updatedSchemaIndexes = schemaIndexes.setSize(index);
        if (value.value > -1) {
          updatedSchemaIndexes = updatedSchemaIndexes.set(index, value.value);
        }

        self.props.onChange(updatedSchemaIndexes);
      };
    };
  }

  onChange(index, value) {
    const { schemaIndexes } = this.props;

    let updatedSchemaIndexes = schemaIndexes.setSize(index);
    if (value.value > -1) {
      updatedSchemaIndexes = updatedSchemaIndexes.set(index, value.value);
    }

    this.props.onChange(updatedSchemaIndexes);
  }

  render() {
    if (!isMultipleChoiceSchema(this.props.schema)) {
      return null;
    }

    let schema = this.props.schema;
    const path = this.props.path;
    let i = 0;
    const schemaSelectors = [];
    while (isMultipleChoiceSchema(schema)) {
      const schemaIndex = this.props.schemaIndexes.get(i, -1);
      const scopedPath = `${path}-${i}`;
      const selectorProps = {
        onChange: this.genOnChange(i), // (value) => this.onChange(i, value),
        schemaIndex,
        schema,
        path: scopedPath,
        key: scopedPath,
      };

      schemaSelectors.push(<SchemaSelector {...selectorProps} />);

      if (schemaIndex > -1) {
        schema = getSchemaByIndex(
          schema,
          schemaIndex,
          this.props.rootSchema,
          true,
        );
      } else {
        schema = null;
      }
      i += 1;
    }

    return <Wrapper>{schemaSelectors}</Wrapper>;
  }
}

SchemaSelectorsStack.propTypes = {
  schemaIndexes: ImmutableProptypes.list.isRequired,
  schema: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  rootSchema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

const mapDispatchToProps = {};

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(SchemaSelectorsStack);
