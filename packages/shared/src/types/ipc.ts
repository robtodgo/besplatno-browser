// Типы IPC-каналов для взаимодействия main и renderer процессов

export type IpcChannel =
  | 'window-minimize'
  | 'window-maximize'
  | 'window-close'
  | 'tab-create'
  | 'tab-switch'
  | 'tab-close'
  | 'tab-pin'
  | 'tab-update'
  | 'navigation-back'
  | 'navigation-forward'
  | 'navigation-reload'
  | 'navigation-stop'
  | 'navigation-navigate'
  | 'bookmarks-add'
  | 'bookmarks-remove'
  | 'bookmarks-list'
  | 'history-add'
  | 'history-list'
  | 'history-clear'
  | 'downloads-list'
  | 'extensions-list'
  | 'theme-change';

export interface IpcMessage<T = unknown> {
  channel: IpcChannel;
  payload: T;
}

export interface TabCreatePayload {
  url?: string;
  isPrivate?: boolean;
}

export interface TabSwitchPayload {
  tabId: string;
}

export interface NavigationPayload {
  url: string;
  tabId?: string;
}
