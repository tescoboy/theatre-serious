import { slugify } from "./slug.js";

export function showHome() {
  console.log("Showing home view");
  // Trigger the dashboard view using the existing app structure
  if (window.app) {
    window.app.handleViewChanged('dashboard');
  }
}

export function showReview(params) {
  console.log(`Showing review: ${params.year}/${params.slug}`);
  
  if (window.app) {
    const reviewsView = window.app.reviewsView;
    console.log('ReviewsView available:', !!reviewsView);
    console.log('ReviewsView has showReviewBySlug:', !!(reviewsView && reviewsView.showReviewBySlug));
    
    if (reviewsView && reviewsView.showReviewBySlug) {
      console.log('Attempting to find review with slug:', params.slug, 'year:', params.year);
      const found = reviewsView.showReviewBySlug(params.slug, params.year);
      console.log('Review found:', found);
      
      if (found) {
        // Only show the reviews view after we've found the specific review
        window.app.handleViewChanged('reviews');
      } else {
        console.error(`Review not found: ${params.year}/${params.slug}`);
        // Let's debug what reviews are available
        if (reviewsView.playsData) {
          const playsWithReviews = reviewsView.playsData.filter(play => play.review && play.review.trim() !== '');
          console.log('Available reviews:', playsWithReviews.map(play => {
            const slug = reviewsView.slugify(`${play.name} ${play.theatre || ''}`);
            const year = new Date(play.date || play.review_updated_at).getFullYear();
            return { name: play.name, slug, year };
          }));
        }
        showHome(); // Fallback to home
      }
    } else {
      console.error('ReviewsView not available');
      showHome(); // Fallback to home
    }
  } else {
    console.error('App not available');
    showHome(); // Fallback to home
  }
}

// Helper function to generate review links (hash-based)
export function generateReviewLink(review) {
  const slug = slugify(`${review.name} ${review.theatre || ''}`);
  const year = new Date(review.date || review.review_updated_at).getFullYear();
  return `#/reviews/${year}/${slug}`;
}

// Helper function to share a review (hash-based)
export function shareReview(review) {
  const slug = slugify(`${review.name} ${review.theatre || ''}`);
  const year = new Date(review.date || review.review_updated_at).getFullYear();
  const url = location.origin + location.pathname + `#/reviews/${year}/${slug}`;
  const text = `Review: ${review.name} at ${review.theatre || 'Unknown venue'}`;
  
  // Copy to clipboard instead of WhatsApp
  navigator.clipboard.writeText(url).then(() => {
    alert("Link copied to clipboard!");
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    alert("Link copied to clipboard!");
  });
} 