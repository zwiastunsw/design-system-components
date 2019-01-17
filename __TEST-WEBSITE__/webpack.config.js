const path = require( 'path' );

module.exports = {
    "mode": "development",
    "entry": "./App.js",
    "output": {
        "path": __dirname+'/dist',
        "filename": "app.min.js"
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: true,
        port: 3000,
        open: true
    },
    "module": {
        "rules": [
            {
                "test": /\.(js|jsx)$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ]
                    }
                }
            },
            {
                "test": /\.scss$/,
                "use": [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.md$/,
                use: [
                    "html-loader", 
                    "markdown-loader"
                ]
            }
        ]
    }
}