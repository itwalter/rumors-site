# rumors-site
Rumors list / creation UI, with server-side rendering

## Development

```
$ yarn
$ npm run dev
```

### styled-jsx syntax highlighting

#### Atom

![styled-jsx syntax highlight in Atom](http://i.imgur.com/F4vbN4h.png)

1. Install `language-postcss` and `language-babel`
2. Open up `laguage-babel`'s setting page
3. Set `Javascript Tagged Template Literal Grammar Extensions` to : `"/\\*\\s*css\\s*\\*/":source.css.scss`
4. Wait for 10 seconds for this to apply

Now whenever we use `<style jsx>`, put `/* css */` before the template string will enable
css syntax highlight.


#### Other editors
![自求多福](http://i.imgur.com/YqN4wEv.png)

## Deploy

Build docker image

```
$ npm run build
```

Run the docker image on local machine, then visit `http://localhost:3000`.

```
$ docker run --rm -p 3000:3000 -e "PORT=3000" mrorz/rumors-site
```

Push to dockerhub
```
$ docker push mrorz/rumors-site
```
