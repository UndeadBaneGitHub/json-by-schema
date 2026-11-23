/*
 * ConfigPanel Messages
 *
 * This contains all the text for the ConfigPanel component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'jsonBySchema.containers.ObjectPanel.header',
    defaultMessage: 'This is ObjectPanel container !',
  },
  filter: {
    id: 'jsonBySchema.containers.ObjectPanel.filter',
    defaultMessage: 'Filter...',
  },
  parentFilter: {
    id: 'jsonBySchema.containers.ObjectPanel.parentfilter',
    defaultMessage: 'Parent filter: ',
  },
  validationFailedPrefix: {
    id: 'jsonBySchema.containers.ObjectPanel.validationFailedPrefix',
    defaultMessage: 'Validation failed for "{propName}": {message}',
  },
  validationFailedSeeMore: {
    id: 'jsonBySchema.containers.ObjectPanel.validationFailedSeeMore',
    defaultMessage: 'Validation failed for "{propName}"! Check property in the list for specific errors.',
  },
  ownValidationFailedPrefix: {
    id: 'jsonBySchema.containers.ObjectPanel.ownValidationFailedPrefix',
    defaultMessage: 'Validation failed: {message}',
  },
  noSchemaFound: {
    id: 'jsonBySchema.containers.ObjectPanel.noSchemaFound',
    defaultMessage: 'No schema found!',
  },
  item: {
    id: 'jsonBySchema.containers.ObjectPanel.item',
    defaultMessage: 'Item #{propName}',
  },
  noItemsFound: {
    id: 'jsonBySchema.containers.ObjectPanel.noItemsFound',
    defaultMessage: 'No items found here by this filter, sorry.',
  },
  errorsCount: {
    id: 'jsonBySchema.containers.ObjectPanel.errorsCount',
    defaultMessage: 'Total errors count: ',
  },
});
