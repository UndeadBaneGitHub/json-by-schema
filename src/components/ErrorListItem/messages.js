/** * ErrorListItem Messages
 *
 * This contains all the text for the ErrorListItem component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  debug: {
    id: 'jsonBySchema.components.ErrorListItem.debug',
    defaultMessage: '[DEBUG] ',
  },
  info: {
    id: 'jsonBySchema.components.ErrorListItem.info',
    defaultMessage: '[INFO] ',
  },
  warning: {
    id: 'jsonBySchema.components.ErrorListItem.warning',
    defaultMessage: '[WARNING] ',
  },
  error: {
    id: 'jsonBySchema.components.ErrorListItem.error',
    defaultMessage: '[ERROR] ',
  },
});
