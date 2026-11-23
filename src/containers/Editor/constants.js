/*
 *
 * Editor constants
 *
 */
import { genId } from '../../utils/generalUtils';

const importedId = genId();

export const DOMAIN_NAME = `${importedId}-editor`;

export const INITIALIZE = `jsonBySchema/${importedId}/Editor/INITIALIZE`;
export const UPDATE_PATH = `jsonBySchema/${importedId}/Editor/UPDATE_PATH`;

export const UPDATE_CONFIG_FOR_PATH = `jsonBySchema/${importedId}/Editor/UPDATE_CONFIG_FOR_PATH`;
export const DELETE_CONFIG_FOR_PATH = `jsonBySchema/${importedId}/Editor/DELETE_CONFIG_FOR_PATH`;
