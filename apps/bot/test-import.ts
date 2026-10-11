async function test() {
  try {
    const scamDetector = await import('./src/utils/scamDetector');
    console.log('Module loaded:', scamDetector);
    console.log('detectScam?:', 'detectScam' in scamDetector);
    console.log('Keys:', Object.keys(scamDetector));
  } catch (error: any) {
    console.error('Error loading module:', error.message);
    console.error('Stack:', error.stack);
  }
}

test();
