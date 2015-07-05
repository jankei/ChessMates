angular.module('blockchess.utilities.suggestedMoves', [])
.directive('suggestedMoves', suggestedMoves)

function suggestedMoves() {
  return {
    templateUrl: "client/utilities/suggested_moves/suggested_moves.ng.html",
    restrict: 'E',
    controller: suggestedMovesController,
    scope: { moves: '=', selectedMove: '=' }
  }
}

function suggestedMovesController($rootScope, $scope) {
  $scope.select = function(move) {
    $scope.selectedMove = move;
  }
}