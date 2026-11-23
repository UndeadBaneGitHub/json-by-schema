/*
 * SchemaSelector Messages
 *
 * This contains all the text for the SchemaSelector component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  titlePrefix: {
    id: 'jsonBySchema.components.SchemaSelector.titlePrefix',
    defaultMessage: 'Subschema #',
  },
  unselectedMessage: {
    id: 'jsonBySchema.components.SchemaSelector.unselectedMessage',
    defaultMessage: 'Pick a subschema...',
  },
  oneOf: {
    id: 'jsonBySchema.components.SchemaSelector.oneOf',
    defaultMessage: 'One of:',
  },
  anyOf: {
    id: 'jsonBySchema.components.SchemaSelector.anyOf',
    defaultMessage: 'Any of:',
  },
  allOf: {
    id: 'jsonBySchema.components.SchemaSelector.allOf',
    defaultMessage: 'All of:',
  },
});
