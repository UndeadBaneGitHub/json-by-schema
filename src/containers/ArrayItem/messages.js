/*
 * ArrayItem Messages
 *
 * This contains all the text for the ArrayItem component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  item: {
    id: 'jsonBySchema.containers.ArrayItem.item',
    defaultMessage: 'Item #',
  },
  validationFailed: {
    id: 'jsonBySchema.containers.ArrayItem.validationFailed',
    defaultMessage: 'Validation failed: {errorMessage}',
  },
});
