import { Downloader } from 'nodejs-file-downloader';

// Fonts
const fonts = [
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '900',
            src: [
                {
                    src: 'https://use.typekit.net/af/846224/00000000000000007735e602/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/846224/00000000000000007735e602/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/846224/00000000000000007735e602/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'italic',
            'font-weight': '900',
            src: [
                {
                    src: 'https://use.typekit.net/af/a7a503/00000000000000007758cf7c/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i9&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/a7a503/00000000000000007758cf7c/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i9&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/a7a503/00000000000000007758cf7c/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i9&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '700',
            src: [
                {
                    src: 'https://use.typekit.net/af/5be242/00000000000000007735e603/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/5be242/00000000000000007735e603/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/5be242/00000000000000007735e603/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'italic',
            'font-weight': '700',
            src: [
                {
                    src: 'https://use.typekit.net/af/38ea3a/00000000000000007758cf7d/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/38ea3a/00000000000000007758cf7d/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/38ea3a/00000000000000007758cf7d/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '800',
            src: [
                {
                    src: 'https://use.typekit.net/af/99d25e/00000000000000007735e611/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/99d25e/00000000000000007735e611/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/99d25e/00000000000000007735e611/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'italic',
            'font-weight': '800',
            src: [
                {
                    src: 'https://use.typekit.net/af/57ba91/00000000000000007758cf8c/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i8&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/57ba91/00000000000000007758cf8c/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i8&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/57ba91/00000000000000007758cf8c/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i8&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '100',
            src: [
                {
                    src: 'https://use.typekit.net/af/4b22bb/00000000000000007735e601/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n1&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/4b22bb/00000000000000007735e601/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n1&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/4b22bb/00000000000000007735e601/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n1&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'italic',
            'font-weight': '100',
            src: [
                {
                    src: 'https://use.typekit.net/af/da27c4/00000000000000007758cf8d/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i1&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/da27c4/00000000000000007758cf8d/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i1&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/da27c4/00000000000000007758cf8d/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i1&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '600',
            src: [
                {
                    src: 'https://use.typekit.net/af/e37e5a/00000000000000007735e60d/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/e37e5a/00000000000000007735e60d/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/e37e5a/00000000000000007735e60d/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'italic',
            'font-weight': '600',
            src: [
                {
                    src: 'https://use.typekit.net/af/0bd0af/00000000000000007758cf8e/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i6&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/0bd0af/00000000000000007758cf8e/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i6&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/0bd0af/00000000000000007758cf8e/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i6&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '400',
            src: [
                {
                    src: 'https://use.typekit.net/af/d7ff92/00000000000000007735e609/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/d7ff92/00000000000000007735e609/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/d7ff92/00000000000000007735e609/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'italic',
            'font-weight': '400',
            src: [
                {
                    src: 'https://use.typekit.net/af/6eb0e3/00000000000000007758cf8f/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/6eb0e3/00000000000000007758cf8f/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/6eb0e3/00000000000000007758cf8f/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '300',
            src: [
                {
                    src: 'https://use.typekit.net/af/3888dc/00000000000000007735e606/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/3888dc/00000000000000007735e606/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/3888dc/00000000000000007735e606/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'italic',
            'font-weight': '300',
            src: [
                {
                    src: 'https://use.typekit.net/af/0b8052/00000000000000007758cf90/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i3&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/0b8052/00000000000000007758cf90/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i3&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/0b8052/00000000000000007758cf90/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i3&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '500',
            src: [
                {
                    src: 'https://use.typekit.net/af/26f7ec/00000000000000007735e605/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/26f7ec/00000000000000007735e605/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/26f7ec/00000000000000007735e605/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'proxima-nova',
            'font-stretch': 'normal',
            'font-style': 'italic',
            'font-weight': '500',
            src: [
                {
                    src: 'https://use.typekit.net/af/c7cac4/00000000000000007735e60e/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i5&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/c7cac4/00000000000000007735e60e/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i5&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/c7cac4/00000000000000007735e60e/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i5&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'trajan-pro',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '400',
            src: [
                {
                    src: 'https://use.typekit.net/af/99c2d8/00000000000000007735d5fd/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/99c2d8/00000000000000007735d5fd/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/99c2d8/00000000000000007735d5fd/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'trajan-pro',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '700',
            src: [
                {
                    src: 'https://use.typekit.net/af/8985b7/00000000000000007735d603/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/8985b7/00000000000000007735d603/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/8985b7/00000000000000007735d603/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'trajan-pro',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '200',
            src: [
                {
                    src: 'https://use.typekit.net/af/0e0db4/00000000000000007735d605/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n2&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/0e0db4/00000000000000007735d605/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n2&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/0e0db4/00000000000000007735d605/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n2&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'trajan-pro',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '300',
            src: [
                {
                    src: 'https://use.typekit.net/af/d18134/00000000000000007735d608/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/d18134/00000000000000007735d608/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/d18134/00000000000000007735d608/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'trajan-pro',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '600',
            src: [
                {
                    src: 'https://use.typekit.net/af/a4a436/00000000000000007735d60a/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/a4a436/00000000000000007735d60a/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/a4a436/00000000000000007735d60a/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3',
                    type: 'otf',
                },
            ],

        },
        {

            'font-display': 'auto',
            'font-family': 'trajan-pro',
            'font-stretch': 'normal',
            'font-style': 'normal',
            'font-weight': '900',
            src: [
                {
                    src: 'https://use.typekit.net/af/eb6c98/00000000000000007735d60d/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3',
                    type: 'woff2',
                },
                {
                    src: 'https://use.typekit.net/af/eb6c98/00000000000000007735d60d/31/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3',
                    type: 'woff',
                },
                {
                    src: 'https://use.typekit.net/af/eb6c98/00000000000000007735d60d/31/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3',
                    type: 'otf',
                },
            ],

        },
    ]

    , downloads = fonts.flatMap(
        font => {

            const urls = font.src.map(
                url => {

                    const config = {
                            cloneFiles: false,
                            directory: `./public/fonts/${ font[ 'font-family' ] }/`,
                            fileName: `${ font[ 'font-family' ] }-${ font[ 'font-weight' ] || 'normal' }-${ font[ 'font-style' ] || 'normal' }.${ url.type }`,
                            url: url.src,
                        }

                        , downloader = new Downloader( config );

                    return downloader;

                }
            );

            return urls;

        }
    )
;

for await( const promise of downloads )
    await promise.download();

