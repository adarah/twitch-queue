import {atom} from 'jotai'

export const viewerIdentified = atom(false);

// https://dev.twitch.tv/docs/extensions/required-technical-background/#opaque-ids
export function isViewerAuthenticated(): boolean {
    return window.Twitch.ext.viewer.opaqueId[0] === 'U';
}

export function isViewerIdentityLinked(): boolean {
    return window.Twitch.ext.viewer.isLinked;
}

export function requestViewerIdentity(): void {
    window.Twitch.ext.actions.requestIdShare();
}