# Image Processing Api

image placeholder api creates and handle images from local disk and allowing resize and basic operations.

### Supported Features

- `width`: number
- `height`: number
- `fit`: string, one of `'cover'`, `'contain'` , `'fill'` , `'inside'` , `'outside'`, (default: 'cover')
- `flip`: boolean
- `rotate`: number
- `format`: string, one of `'jpg'`, `'jpeg'`, `'png'`

### Example

```
http://localhost:3000/api/images?filename=fjord&width=500&height=400&fit=cover&rotate=170&flip=true&format=png
```

## Getting Started

### Installation

clone repository to your local machine and install dependencies.

```
git clone git@github.com:tarek-elmasri/image_processing.git
npm install
npm start
```

### Available Scripts

- `start`: to run production build.
- `dev`: to run development server.
- `build`: transpile typescript to es5.
- `lint`: eslint script.
- `test`: run tests.
- `prettier`: formatting.
