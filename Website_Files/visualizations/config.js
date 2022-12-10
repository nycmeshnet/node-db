var config = {
    style: 'mapbox://styles/mjh2241/clbgpc5ed000w15o7marj9y8v',
    accessToken: 'pk.eyJ1IjoibWpoMjI0MSIsImEiOiJjbDZhNWdtdWcwemYwM2Nyejg4azR6MjdtIn0.jcFs6eofGMkSv7Gokq_b6A',
    showMarkers: false,
    theme: 'light',
    alignment: 'left',
    title: '',
    subtitle: '',
    byline: '',
    footer: '',
    chapters: [
        {
            id: 'chapter1',
            title: 'The first node',
            image: '',
            description: 'blah blah',
            location: {
                center: [-73.989, 40.725],
                zoom: 16.5,
                pitch: 29,
                bearing: 0.00
            },
            onChapterEnter: [
                {
                    layer: 'node-3',
                    opacity: .9,
                    // layer: 'data-driven-circles',
                    // opacity: 0,
                    layer: 'data-driven-lines',
                    opacity: 0
                }
            ],
            onChapterExit: [
                {
                    layer: 'node_3',
                    opacity: 0.0
                }
            ]
        },
        {
            id: 'chapter2',
            title: 'Nodes multiply',
            image: '',
            description: '',
            location: {
                center: [-73.99, 40.722],
                zoom: 14.5,
                pitch: 43.50,
                bearing: 96.80
            },
            onChapterEnter: [
                {
                    layer: 'data-driven-circles',
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    // layer: 'pennypack',
                    // opacity: 0
                }
            ]
        },
        {
            id: 'chapter3',
            title: 'A network emerges',
            image: '',
            description: '',
            location: {
                center: [-73.99, 40.722],
                zoom: 14.5,
                pitch: 43.50,
                bearing: 96.80
            },
            onChapterEnter: [
                {
                    layer: 'data-driven-lines',
                    opacity: .75
                }
            ],
            onChapterExit: [
                {
                    // layer: 'pennypack',
                    // opacity: 0
                }
            ]
        },
        {
            id: 'chapter4',
            title: 'The whole shebang',
            image: '',
            description: 'blah blah',
            location: {
                center: [-74.023640, 40.704771],//(Williamsburg Bk map center of gravity)
                zoom: 11.1,
                // maxBounds: bounds, // Sets bounds as max
                pitch:40,
                bearing:29
            },
            onChapterEnter: [
                {
                    layer: 'all-installed-nodes',
                    opacity: .7,
                }
            ],
            onChapterExit: [
                {
                    // layer: 'phl-city-limits',
                    // opacity: 0
                }
            ]
        },
    ]


};