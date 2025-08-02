export function currentReviewFromHash() {
  const hash = location.hash;
  console.log('Checking hash for review:', hash);
  const match = hash.match(/^#\/reviews\/(\d{4})\/([a-z0-9-]+)$/);
  console.log('Hash match result:', match);
  if (match) {
    const result = { year: match[1], slug: match[2] };
    console.log('Found review in hash:', result);
    return result;
  }
  console.log('No review found in hash');
  return null;
}

export function installHashBoot(handlers) {
  console.log('Installing hash boot with handlers:', handlers);
  
  function handleHashChange() {
    console.log('Hash change detected, current hash:', location.hash);
    const review = currentReviewFromHash();
    console.log('Review from hash:', review);
    
    if (review) {
      console.log('Calling onReview with:', review);
      handlers.onReview(review);
    } else {
      console.log('Calling onHome');
      handlers.onHome();
    }
  }

  // Handle initial hash immediately when app is ready
  function handleInitialHash() {
    console.log('Initial hash check, current hash:', location.hash);
    handleHashChange();
  }

  // Check if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOMContentLoaded triggered');
      handleInitialHash();
    });
  } else {
    console.log('DOM already loaded, handling initial hash immediately');
    handleInitialHash();
  }
  window.addEventListener('hashchange', handleHashChange);
  
  console.log('Hash boot installed');
} 