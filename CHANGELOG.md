# v1.13.3

## Bug Fixes

* Fix: developer mode is not working(#335)
* Fix: block links are not displayed in some environments(#336)
* Fix: extra element matched in the top news(#339)

# v1.13.2

## Bug Fixes

* Fix: can't get title if 'g-card' does not contains 'role=heading' attribute(#331)

# v1.13.1

## Bug Fixes

* Fix: 'News' tab does not work(#320)

# v1.13.0

## Enhancements.

* Add: Block 'Movie' in google search(#298)

# v1.12.2

## Bug Fixes

* Fix: update content detection(#295)

# v1.12.1

## Bug Fixes

* Fix: can't block image because Google changed the results(#291)

# v1.12.0

## Enhancements.

* Add: Block new 'Google News' tab(card layout)(#281)

## Bug Fixes

* Fix: cantch exception by invalid regexp(#284)

# v1.11.2

## Bug Fixes

* Fix: cannot click compact menu when tweet is long(#273)

# v1.11.1

## Bug Fixes

* Fix: can't unblock temporarily if the site is blocked by regexp(#275)

# v1.11.0

## Enhancements.

* Add: Block 'Images' tab(#9, #186)

## Improvements:

* Add: add Yahoo! News byline for 'Block recommend path'(#211, #212)
* Add: add note.com for 'Block recommend path'(#217)
* Prettier support(#180)
* remove `tsc` for ci/build(#189, #195)
* set name for beta version(#143, #214)
* use tabby for option(#15, #182, #183)

## Bug Fixes

* Fix: can't block Top News of Google Search(Firefox)(#245, #246)
* Fix: the priority of blocking is incorrect(#249, #250)

# v1.10.0

## Enhancements.

* Add: Block 'News' tab individually(#14, #155)

## Improvements.

* Add: add Twitter for 'Block recommend path'(#57, #174)
* Add: add atwiki for 'Block recommend path'(#29, #174)
* Add: add wikiwiki for 'Block recommend path'(#175, #174)

## Bug Fixes

* Fix: `webpack --watch` does not work(#139, #168)
* Fix: disable 'temporarily unblock all' causes disable 'show information of blocked by banned words'(#149, #176)

# v1.9.0

## Improvements.

* Add: option for display 'Temporarily unblock all'(#101, #142)

## Bug Fixes

* Fix: wrong menu position in compact mode(#40, #117)
* Fix: 'temporarily unblock all' does not working(#148, #141)

# v1.8.5.1

## Bug Fixes

* Fix: urls by banned words does not show hard blocked

# v1.8.5

## Improvements.

* Add: block by regexp from dialog.

# v1.8.4.1

## Bug Fixes

* Fix: Cannot click the icon attached to the top news in compact(#41)
* Fix: Video URL overflows in Firefox(#88)

# v1.8.4

## Bug Fixes

* Fix: Remove fragment(#) from URL(#46)
* Fix: Block anchor is not shown in the Top News(#62)

# v1.8.3

## Bug Fixes

* Fix: Not work due to changed Google search results(#37).

# v1.8.2

## Enhancements.

* Add: Lists URLs that are excluded by banned word(#1).

## Bug Fixes

* Fix: Tweet is not blocked.

# v1.8.1

## Bug Fixes

* Fix: Fix: does not appear block link when using certain browser.
* Fix: Google Top News.

# v1.8.0

## Enhancements.

* Add: 'block by regular exception' option.

## Bug Fixes

* Fix: missed space when import/export Banned Words.
* Fix: English message contained Japanese.

# v1.7.0

## Enhancements.

* Add: 'block current page' popup.

## Bug Fixes.

* Fix: 'temporarily unblock all' does not appear when using toolbox.
* Fix: 'Search in English' is displayed other than Google Search.

# v1.6.0

## Enhancements.

* Add: 'recommended' for block dialog.
* Add: 'temporarily unblock all' link.

## Bug Fixes.

* Fix: non-UTF8 encoding cause Exception.

# v1.5.3

## Enhancements.

* export blockType(soft/hard) of banned word.
* import blockType(soft/hard) of banned word.
* export target(title / title and contents) of banned word.
* import target(title / title and contents) of banned word.

# v1.5.2

## Enhancements.

* Add Banned Word option (title and contents / title only)

## Bug Fixes.

* Remove unnecessary permission(tabs -> activeTab)

# v1.5.1.1

## Bug Fixes.

* Fix: cannot load Banned Words.

# v1.5.1

## Enhancements.

* Add 'Search in English' popup.
* Add 'Search excluding "ikagadesitaka"' (Japanese only.)

## Improvements.

* Add soft/hard option for Banned Words.

# v1.5.0

## Enhancements.

* Can block 'Google Top News'.

## Improvements.

* Add 'Change Block State' link.
* Add 'Menu Position' option.

# v1.4.2

## Bug Fixes.

* Not worked when list map(not Google Maps).

# v1.4.1

## Improvements.

* Change 'Delete' button to 'Unblock'
* Add 'Default Block Type' option.

# v1.4.0

## Enhancements.

* Block if domain is IDN(Internationalized Domain Name).

## Improvements.

* Can block when blocked by Word/IDN.

# v1.3.2

## Improvements.

* Add tab to option page.

## Bug Fixes.

* Fixed error if no content.

# v1.3.1

## Bug Fixes.

* Add supported URLs.
* Cannot block in some domains.

# v1.3.0

## Enhancements.

* Block by keyword.

## Bug Fixes.

* Cannot block(by Google's update).

# v1.2.0

## Improvements.

* Add soft/hard select box when show dialog.

## Bug Fixes.

* Do not clear hard-block when clear all.
* Fixed that full URL is always displayed when blocking.

# v1.1.0

## Enhancements.

* Import with soft/hard.
* Export with soft/hard.

## Improvements.

* Export with sorted.

# v1.0.1

* In the dialog, text after radio make clickable.

# v1.0.0

initial version.
