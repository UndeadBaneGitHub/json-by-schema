/*
 * NewPatternPropertyItem Messages
 *
 * This contains all the text for the NewPatternPropertyItem component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  patterns: {
    id: 'jsonBySchema.containers.NewPatternPropertyItem.patterns',
    defaultMessage: 'Available patterns:',
  },
  name: {
    id: 'jsonBySchema.containers.NewPatternPropertyItem.name',
    defaultMessage: 'New property name:',
  },
  namePlaceholder: {
    id: 'jsonBySchema.containers.NewPatternPropertyItem.namePlaceholder',
    defaultMessage: 'Enter property name...',
  },
  warning: {
    id: 'jsonBySchema.containers.NewPatternPropertyItem.warning',
    defaultMessage: 'Warning: ',
  },
  severalMatchesError: {
    id: 'jsonBySchema.containers.NewPatternPropertyItem.severalMatchesError',
    defaultMessage: 'There are several matches for this property name!',
  },
  duplicatePropNameError: {
    id: 'jsonBySchema.containers.NewPatternPropertyItem.duplicatePropNameError',
    defaultMessage:
      'Property with such name already exists! Please, pick a different one!',
  },
  save: {
    id: 'jsonBySchema.containers.NewPatternPropertyItem.save',
    defaultMessage: 'Save',
  },
});
