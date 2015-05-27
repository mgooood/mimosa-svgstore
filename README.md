mimosa-svgstore
===========

## Overview

This module concatenates a bunch of `.svg` files into a single XML file.

### Why?

The idea is to generate a single master `<svg>` element that can be included in a generated template and used as such:

```html
<!-- #include 'repository.html' (or however the kids are doing it these days) -->

<ul>
  <li>
    <svg class="icon-document" viewBox="0 0 100 100"><use xlink:href="#-svg-repository-document"/></svg>
    <span>Document #1</span>
  </li>
  <li>
    <svg class="icon-document" viewBox="0 0 100 100"><use xlink:href="#-svg-repository-document"/></svg>
    <span>Document #2</span>
  </li>
  ...
  <li>
    <svg class="icon-document" viewBox="0 0 100 100"><use xlink:href="#-svg-repository-document"/></svg>
    <span>Document #50</span>
  </li>
</ul>

<button>
  <svg class="icon-download" viewBox="0 0 100 100"><use xlink:href="#-svg-repository-download"/></svg>
  <span>Download Everything</span>
</button>
```

[Reference, courtesy of MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use).



## Usage

1. Add `'mimosa-svgstore'` to your list of modules.

2. Create `.svg` files into the `assets/svgs` folder.  ***Check the default `viewBox` setting to avoid clipping your images.***

3. Run **`mimosa svgstore`** to generate the repository `repository.html`.



# Default Config

```javascript
svgstore: {
  sourcePattern: 'assets/svgs/**/*.svg',
  outputFile:    'assets/svgs/repository.html',
  repositoryId:  '-svg-repository',
  viewBox:       '0 0 100 100'
}
```

#### `svgstore.sourcePattern` string

A glob that will be used to find the `.svg` files to be processed.

#### `svgstore.outputFile` string

This is the name and path of the repository file that will be created.

#### `svgstore.repositoryId` string

This will be used as the main `<svg/>` tag's `id` attribute and also serves as the prefix for each imported `.svg` file.

#### `svgstore.viewBox` string

Allows the default `viewBox` of the main `<svg/>` tag to be overridden.
