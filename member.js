function skillsMember() {
    return {
      restrict: 'E',
      scope: {
        member: '='
      },
      templateUrl: 'member.html',
      controller: function($scope) {
        $scope.getSkills = function() {
          return $scope.member.skills;
        }
      }
    };
  }