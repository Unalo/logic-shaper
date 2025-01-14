const express = require('express');
const app = express();
const pg  = require('pg');

const PORT = process.env.PORT || 3005;
const { ApiRoutes } = require("./ApiRoutes");
const PuzzleRoutes = require("./PuzzleRoutes");
const { PuzzleCheckerService } = require("./PuzzleCheckerService");

// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://shaper:shaper123@localhost:5432/logic_shaper';

const pool = new pg.Pool({
    connectionString,
  });

const puzzleRoutes = PuzzleRoutes(pool);

app.use(express.static("public"));

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const puzzleCheckerService = PuzzleCheckerService(pool);

const apiRoutes = ApiRoutes(puzzleCheckerService);

app.post('/api/check-answer', apiRoutes.checkAnswer);
app.get('/api/puzzle/:id', puzzleRoutes.getPuzzle);
app.get('/puzzles/', puzzleRoutes.getPuzzles);

app.listen(PORT, function(){
    console.log(`Logic shaper started on at port : ${PORT} `);
});
