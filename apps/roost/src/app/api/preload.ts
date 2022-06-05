try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('electron-reloader')(module);
} catch (error) {
  // ignore in prod
}
