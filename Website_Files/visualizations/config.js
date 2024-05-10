var config = {
    style: 'mapbox://styles/mjh2241/clbgpc5ed000w15o7marj9y8v',
    accessToken: 'pk.eyJ1IjoibWpoMjI0MSIsImEiOiJjbDZhNWdtdWcwemYwM2Nyejg4azR6MjdtIn0.jcFs6eofGMkSv7Gokq_b6A',
    showMarkers: false,
    theme: 'dark',
    alignment: 'left',
    title: '',
    subtitle: '',
    byline: '',
    footer: '',
    chapters: [
        {
            id: 'chapter1',
            title: '',
            image: 'panoramas/3b.jpg',
            description: 'Here is the view from an early mesh node installation. Each node is a router attached to a NYCMesh’ member’s rooftop, installed by volunteers on a donation-based pricing scale.',
            location: {
                center: [-73.989, 40.725],
                zoom: 17.5,
                pitch: 45,
                bearing: 0.00
            },
            onChapterEnter: [
                {
                    layer: 'node-3',
                    opacity: 1,
                    // layer: 'data-driven-circles',
                    // opacity: 0,
                },
                {
                    layer: 'data-driven-circles',
                    opacity: 0
                },
                {
                    layer: 'data-driven-lines',
                    opacity: 0
                },
            ],
            onChapterExit: [
                {
                    layer: 'node-3',
                    opacity: 0.0
                }
            ]
        },
        {
            id: 'chapter2',
            title: 'Nodes',
            image: '',
            description: '<p>Each network “node” point consists of at least one router connection. Most nodes are recipient connections: NYC Mesh users who receive web access through the network.</p><p>Access is distributed by hubs, or clusters of routers and servers, and supernodes, which serve as high-bandwidth thresholds to the Internet at large.</p>',
            location: {
                center: [-73.9873, 40.721],
                zoom: 14.3,
                pitch: 43.50,
                bearing: 96.80
            },
            onChapterEnter: [
                {
                    layer: 'data-driven-circles',
                    opacity: 1
                },
                {
                    layer: 'data-driven-lines',
                    opacity: .0
                }
            ],
            onChapterExit: [
                {
                }
            ]
        },
        {
            id: 'chapter3',
            title: 'Linkages',
            image: '',
            description: 'Since network distribution is dependent on clear lines of sight, distribution points called supernodes and hubs are placed at highly visible locations: tall buildings.',
            location: {
                center: [-73.9873, 40.721],
                zoom: 14.3,
                pitch: 43.50,
                bearing: 96.80
            },
            onChapterEnter: [
                {
                    layer: 'data-driven-lines',
                    opacity: 1,
                }
            ],
            onChapterExit: [
                {
                    // layer: 'data-driven-lines',
                    // opacity: 0
                }
            ]
        },
        {
            id: 'chapter4',
            title: '',
            image: '',
            description: '<p>Supernodes and hubs can support more traffic distributing connections and access to surrounding smaller nodes over time. </p><p>See how a web of connections is woven invisibly through the city, anchored by some of its tallest structures.</p>',
            location: {
                center: [-74.023640, 40.704771],//(Williamsburg Bk map center of gravity)
                zoom: 11.1,
                pitch:40,
                bearing:29
            },
            onChapterEnter: [
                {
                    layer: 'all-installed-nodes',
                    opacity: 1
                },
                {
                    layer: 'data-driven-lines',
                    opacity: .85,
                }
            ],
            onChapterExit: [
                {
                    layer: 'all-installed-nodes',
                    opacity: .0,
                },
                {
                    layer: 'data-driven-lines',
                    opacity: 1,
                }
            ]
        },
    ]
};