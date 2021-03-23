![next portfolio example](example.png)

# next portfolio

Just a weird and cool way to display some of my old [datahacker](http://datahacker.tumblr.com) work.
Uses an [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for
an infinite-scroll-esque feature that updates a responsive voronoi diagram that is used to generate clip paths for images.

### TODO

- Leverage browser cache for image loading (looks like cache misses if you load via `new Image()` then `<image href...>`)
- Consider a [better infinite scroll method](https://developers.google.com/web/updates/2016/07/infinite-scroller)
- Create thumbnail images for vis (using `mogrify`) and only show large sizes on click
- Major cleanup & `useEffect` consolidation around position calculations and `visPage` vs `page + 1`
- Modal for displaying info
- Deploy this somewhere
