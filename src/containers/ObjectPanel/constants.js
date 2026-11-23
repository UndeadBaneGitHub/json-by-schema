/*
 *
 * ConfigPanel constants
 *
 */
import { genId } from '../../utils/generalUtils';

const importedId = genId();

export const DOMAIN_NAME = `${importedId}-objectPanel`;

export const INITIALIZE_EDITOR = `jsonBySchema/${importedId}/ObjectPanel/INITIALIZE_EDITOR`;
export const SELECT_SCHEMA = `jsonBySchema/${importedId}/ObjectPanel/SELECT_SCHEMA`;

export const OPEN_PROPERTY_BY_PATH = `jsonBySchema/${importedId}/ObjectPanel/OPEN_PROPERTY_BY_PATH`;
export const SET_ERRORS = `jsonBySchema/${importedId}/ObjectPanel/SET_ERRORS`;

export const SET_STATE_CONFIG = `jsonBySchema/${importedId}/ObjectPanel/SET_STATE_CONFIG`;
export const RESET_OPEN_PROPERTY = `jsonBySchema/${importedId}/ObjectPanel/RESET_OPEN_PROPERTY`;

export const UPDATE_OPEN_PROPERTY_BY_PATH = `jsonBySchema/${importedId}/ObjectPanel/UPDATE_OPEN_PROPERTY_BY_PATH`;

export const SHOW_NEW_PATTERN_PROPERTY_ITEM = `jsonBySchema/${importedId}/ObjectPanel/SHOW_NEW_PATTERN_PROPERTY_ITEM`;
export const HIDE_NEW_PATTERN_PROPERTY_ITEM = `jsonBySchema/${importedId}/ObjectPanel/HIDE_NEW_PATTERN_PROPERTY_ITEM`;

export const CHANGE_FILTER = `jsonBySchema/${importedId}/ObjectPanel/CHANGE_FILTER`;
export const RESET_FILTER = `jsonBySchema/${importedId}/ObjectPanel/RESET_FILTER`;

export const TOGGLE_EDIT_AS_JSON = `jsonBySchema/${importedId}/ObjectPanel/TOGGLE_EDIT_AS_JSON`;
