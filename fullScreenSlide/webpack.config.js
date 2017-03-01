var webpack = require("webpack");
var path = require("path");

var config = {
    entry: "./css/style.scss",
    output: {
        path: path.resolve(__dirname,"css"),
        filename: "style.css"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },{
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader"
            },{
                test: /\.(png|jpg)$/,
                loader: "url-loader"
            },{
                test: /\.js$/,
                loader: "babel-loader"
            }
        ]
    }
};

module.exports = config;