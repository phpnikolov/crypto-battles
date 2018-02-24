# CryptoBattles


## Post Installation

Angular cli don't support **crypto**. Check the [issue](https://github.com/angular/angular-cli/issues/1548)

To enable it, go to
```
\node_modules\@angular\cli\models\webpack-configs\browser.js
```

find this line
```javascript
node: {
    ...
    crypto: 'empty',
    ...
}
```
and change it to
```javascript
node: {
    ...
    crypto: true,
    ...
}
```