<h2>Lightbox<span class="status refactor">Needs refactoring</span><span class="status js">JS</span></h2>

In order to link a trigger element like a button that opens the lightbox you need to provide an `id` for the lightbox
and add the `data-lightbox-open="ID"` to your trigger element.

For closing you can add the `data-lightbox-close` attribute to any element that should trigger closing of the lightbox.

If you need a custom identifier for your lightbox add `data-custom='String'` attribute to you `as24-lightbox` element. It will be automatically applied to div which contains overlay and content of the lightbox.

In case you need to disable closing when clicking outside the lightbox you can provide the `prevent-outsideclose` attribute
to the as24-lightbox element like so `<as24-lightbox class="sc-lightbox" id="lb1" prevent-outsideclose>`.

In case you need to disable opening lightbox when clicking button that opens the lightbox, you can provide the `data-lightbox-prevent-open="true"` attribute. And you can switch this to `data-lightbox-prevent-open="false"` if you want to open it.

You can register (multiple) callbacks for when the lightbox opens/closes by calling the `registerOnOpenCallback, registerOnCloseCallback` methods on the `<as24-lightbox>` DOM element, i.e. <br/><br/>

```js
const myLightbox = document.getElementsByTagName("as24-lightbox")[0];
myLightbox.registerOnOpenCallback(() => console.log("open!"));
```

To trigger the lightbox programmatically you can use its `show` function like this:<br/><br/>

```js
const myLightbox = document.getElementsByTagName("as24-lightbox")[0];
myLightbox.show();
```

To trigger the lightbox programmatically you can use its `hide` function like this:<br/><br/>

```js
const myLightbox = document.getElementsByTagName("as24-lightbox")[0];
myLightbox.hide();
```
