angular.module('blockchess.utilities.engine', [])
.service('Engine', Engine)

function Engine($rootScope) {
  var engine = getEngine();
  var evaler = getEvaler();
  var config = { depth: "3" };
  uciCmd('ucinewgame');
  uciCmd('isready');
    
  return {
    setPosition: setPosition,
    getMove: getMove,
    promptMove: promptMove,
    setOptions: setOptions
  }

  function getMove(moves) {
    setPosition(moves);
    promptMove();
  }

  function getEngine() {
    var line;
    eng = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker(config.stockfishjs || 'stockfish.js');
    eng.onmessage = function(e) { 
      if (e && typeof e === "object") {
          line = e.data;
      } else {
          line = e;
      }
    console.log("Angular Stockfish: Engine: " + line);
    var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
    if(match) {
      var from      = match[1]; 
      var to        = match[2]; 
      var promotion = match[3]
      $rootScope.$broadcast('angularStockfish::bestMove', from, to, promotion);
    } 

  }

    return eng;
  }

  function getEvaler() {
    var line;
    ev = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker(config.stockfishjs || 'stockfish.js');
    ev.onmessage = function(e) {
      if (e && typeof e === "object") {
          line = e.data;
      } else {
          line = e;
      }
      console.log("Angular Stockfish: Evaler: " + line);
    }
    return ev;
  }

  // moves is a string in the format 'e2e4 e7e5'
  // Sets the position of the game to the engine
  function setPosition(moves) {
    uciCmd('position startpos moves ' + moves);
    uciCmd('position startpos moves ' + moves, evaler);
    uciCmd("eval", evaler);
  }

  // Prompt the engine for move based on position (call setPosition before this method)
  function promptMove() {
    if (config.time && config.time.wtime) {
      uciCmd("go depth " + config.depth + " wtime " + config.time.wtime + " winc " + config.time.winc + " btime " + config.time.btime + " binc " + config.time.binc);
    } else {
      uciCmd("go depth " + config.depth);
    }
  }

  // Send commands to the engine
  function uciCmd(cmd) {
    console.log("Angular Stockfish: UCI: " + cmd);
    engine.postMessage(cmd);
  }

  function setOptions(options) {
    config = options;
  }

}