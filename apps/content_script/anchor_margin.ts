const SEARCH_RESULT_TYPE = "google-search-result";

// ignore sub-pixel rounding noise.
const MIN_GAP_PX = 1;

export interface AnchorMargins {
  top: string;
  bottom: string;
}

export function computeAnchorMargins(gap: number): AnchorMargins | null {
  if (!Number.isFinite(gap) || gap < MIN_GAP_PX) {
    return null;
  }

  return { top: `-${gap}px`, bottom: `${gap}px` };
}

/**
 * Google ships multiple search result layouts. Depending on the layout, a
 * visible gap appears between the result element and the inserted anchor
 * (caused by bottom padding on the result, or by margins collapsing out of
 * its descendants), while other layouts leave no gap at all. Measure the
 * actually rendered gap and pull the anchor up by the same amount, so the
 * anchor sits right under the snippet in any layout.
 */
export function adjustAnchorMargin(target: Element, anchor: HTMLElement): void {
  if (target.getAttribute("data-gsb-element-type") !== SEARCH_RESULT_TYPE) {
    return;
  }

  const gap =
    anchor.getBoundingClientRect().top - target.getBoundingClientRect().bottom;
  const margins = computeAnchorMargins(gap);

  if (margins === null) {
    return;
  }

  anchor.style.marginTop = margins.top;
  anchor.style.marginBottom = margins.bottom;
}
