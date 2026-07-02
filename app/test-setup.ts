// Stub jsdom's unimplemented window.scrollTo to silence warnings
// (tests that need to verify scroll behavior use vi.spyOn which replaces this).
window.scrollTo = () => {}