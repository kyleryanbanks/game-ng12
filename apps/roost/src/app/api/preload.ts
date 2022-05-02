try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('electron-reloader')(module);
} catch (error) {
  console.log(error);
}
