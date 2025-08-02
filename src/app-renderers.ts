import { slugify } from "./slug.js";
import { linkForReview, shareToWhatsApp } from "./router-lite.js";

// Global app instance - will be set by the main app
declare global {
  interface Window {
    app: any;
  }
}

export function showHome() {
  console.log("Showing home view");
  // Trigger the dashboard view using the existing app structure
  if (window.app) {
    window.app.handleViewChanged('dashboard');
  }
}

export function showReview(params: { year: string; slug: string }) {
  console.log(`Showing review: ${params.year}/${params.slug}`);
  
  // Show the reviews view first
  if (window.app) {
    window.app.handleViewChanged('reviews');
    
    // Give the app a moment to switch views, then find the review
    setTimeout(() => {
      const reviewsView = window.app.reviewsView;
      if (reviewsView && reviewsView.showReviewBySlug) {
        const found = reviewsView.showReviewBySlug(params.slug, params.year);
        if (!found) {
          console.error(`Review not found: ${params.year}/${params.slug}`);
          showHome(); // Fallback to home
        }
      } else {
        console.error('ReviewsView not available');
        showHome(); // Fallback to home
      }
    }, 100);
  } else {
    console.error('App not available');
    showHome(); // Fallback to home
  }
}

// Helper function to generate review links
export function generateReviewLink(review: any): string {
  const slug = slugify(`${review.name} ${review.theatre || ''}`);
  const year = new Date(review.date || review.review_updated_at).getFullYear();
  return `/reviews/${year}/${slug}`;
}

// Helper function to share a review
export function shareReview(review: any) {
  const slug = slugify(`${review.name} ${review.theatre || ''}`);
  const year = new Date(review.date || review.review_updated_at).getFullYear();
  const url = location.origin + `/reviews/${year}/${slug}`;
  const text = `Review: ${review.name} at ${review.theatre || 'Unknown venue'}`;
  shareToWhatsApp(url, text);
} 