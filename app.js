var app = require('express')();
var body_parser = require('body-parser');
app.set("view engine", "ejs");
app.use(body_parser.urlencoded({
    extended: true
}));
var places;
places = [{
        title: 'shudnrobon',
        image: 'https://i.imgur.com/WtV25d8.jpg',
        description: 'Null'
    },
    {
        title: 'drug',
        image: 'https://i.imgur.com/mWROmGo.jpg',
        description: 'Null'
    },
    {
        title: 'cross',
        image: 'https://i.imgur.com/fO3Q5K8.jpg',
        description: 'Null'
    },
    {
        title: 'banana',
        image: 'https://i.imgur.com/ErxsQ80.jpg',
        description: 'Null'
    },
    {
        title: 'fish',
        image: 'https://images.unsplash.com/photo-1485452499676-62ab02c20e83?dpr=1&auto=format&fit=crop&w=767&h=511&q=60&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D',
        description: 'Null'
    },
    {
        title: 'shudnrobon',
        image: 'https://i.imgur.com/WtV25d8.jpg',
        description: 'Null'
    },
    {
        title: 'drug',
        image: 'https://i.imgur.com/mWROmGo.jpg',
        description: 'Null'
    },
    {
        title: 'cross',
        image: 'https://i.imgur.com/fO3Q5K8.jpg',
        description: 'Null'
    },
    {
        title: 'banana',
        image: 'https://i.imgur.com/ErxsQ80.jpg',
        description: 'Null'
    },
    {
        title: 'fish',
        image: 'https://images.unsplash.com/photo-1485452499676-62ab02c20e83?dpr=1&auto=format&fit=crop&w=767&h=511&q=60&cs=tinysrgb&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D',
        description: 'Null'
    },
    
];

app.get('/', function (request, response) {
    response.render('home', {
        places: places
    });
});

app.post('/photoAdded', function (request, response) {
    places.push({
        title: request.body.title,
        image: request.body.image,
        description: request.body.description
    });
    response.redirect('/');
});

app.get('/addPhoto', function (request, response) {
    response.render("addPhoto");
});


app.listen(3000, function () {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('http://' + add + ':3000');
    });
});