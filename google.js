var selector = "h3.r > a:not([href*='webcache.googleusercontent.com']), g-inner-card > a";
document.querySelectorAll(selector).forEach(function(a) {
	console.log(a.href);
});
