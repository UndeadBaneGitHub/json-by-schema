/*
 * PropertyEditor Messages
 *
 * This contains all the text for the PropertyEditor component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'jsonBySchema.containers.PropertyEditor.header',
    defaultMessage: 'This is PropertyEditor container !',
  },
  name: {
    id: 'jsonBySchema.containers.PropertyEditor.name',
    defaultMessage: 'Name: ',
  },
  type: {
    id: 'jsonBySchema.containers.PropertyEditor.type',
    defaultMessage: 'Type: ',
  },
  namePrefix: {
    id: 'jsonBySchema.containers.PropertyEditor.namePrefix',
    defaultMessage: 'Item #',
  },
  description: {
    id: 'jsonBySchema.containers.PropertyEditor.description',
    defaultMessage: 'Description: ',
  },
  value: {
    id: 'jsonBySchema.containers.PropertyEditor.value',
    defaultMessage: 'Value: ',
  },
  validationFailed: {
    id: 'jsonBySchema.containers.PropertyEditor.validationFailed',
    defaultMessage: '{errorMessage}',
  },
  validationFailedHeader: {
    id: 'jsonBySchema.containers.PropertyEditor.validationFailedHeader',
    defaultMessage: 'Validation errors:',
  },
});
