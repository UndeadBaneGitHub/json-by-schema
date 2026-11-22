/*
 * PropertyListItem Messages
 *
 * This contains all the text for the PropertyListItem component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'jsonBySchema.containers.PropertyListItem.header',
    defaultMessage: 'This is PropertyListItem container !',
  },
  name: {
    id: 'jsonBySchema.containers.PropertyListItem.name',
    defaultMessage: 'Name: ',
  },
  type: {
    id: 'jsonBySchema.containers.PropertyListItem.type',
    defaultMessage: 'Type: ',
  },
  description: {
    id: 'jsonBySchema.containers.PropertyListItem.description',
    defaultMessage: 'Description: ',
  },
  noSchemaFound: {
    id: 'jsonBySchema.containers.PropertyListItem.noSchemaFound',
    defaultMessage: 'No schema was found for this property!',
  },
  noConfigFound: {
    id: 'jsonBySchema.containers.PropertyListItem.noConfigFound',
    defaultMessage: 'No config was found for this property!',
  },
  removeProperty: {
    id: 'jsonBySchema.containers.PropertyListItem.removeProperty',
    defaultMessage: 'Remove property',
  },
  validationFailed: {
    id: 'jsonBySchema.containers.PropertyListItem.validationFailed',
    defaultMessage: 'Validation failed: {errorMessage}',
  },
});
