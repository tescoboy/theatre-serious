import { slugify } from "./slug.js";

export async function copyReviewLink(review) {
  const year = new Date(review.date).getUTCFullYear();
  const slug = slugify(`${review.name} ${review.theatre || ''}`);
  const url = `${location.origin}${location.pathname}#/reviews/${year}/${slug}`;
  
  try {
    await navigator.clipboard.writeText(url);
    alert("Link copied");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = url; 
    document.body.appendChild(ta);
    ta.select(); 
    document.execCommand("copy"); 
    ta.remove();
    alert("Link copied");
  }
} 