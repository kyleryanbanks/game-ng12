import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';

declare global {
  interface Window {
    process: {
      type: string;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class ElectronGuard implements CanLoad {
  canLoad(): boolean {
    // Renderer process
    if (
      typeof window !== 'undefined' &&
      typeof window.process === 'object' &&
      window.process.type === 'renderer'
    ) {
      return false;
    }

    // Main process
    if (
      typeof process !== 'undefined' &&
      typeof process.versions === 'object' &&
      !!process.versions.electron
    ) {
      return false;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (
      typeof navigator === 'object' &&
      typeof navigator.userAgent === 'string' &&
      navigator.userAgent.indexOf('Electron') >= 0
    ) {
      return false;
    }

    return true;
  }
}
