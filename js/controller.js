(function() {
    'use strict';

    angular
        .module('buildnote')
        .controller('InputController', InputController);

    InputController.$inject = ['$scope', '$http', 'systemList', 'authorList', 'distSystemList'];

    function InputController($scope, $http, systemList, authorList, distSystemList) {
    	$scope.user = {}
        $scope.buildNote = {};

        $scope.task = {}; // Redmine Task 정보
        $scope.sql = {}; // SQL 
        $scope.dependency = {}

        $scope.requesters = new Array();
        $scope.changeSystems = new Array();
        $scope.requirements = new Array();
        $scope.distSystems = new Array();
        $scope.files = new Array();

        // function
        $scope.redmineSearch = redmineSearch;
        $scope.buildComplete = buildComplete;
        $scope.register = register;

        $scope.systemList = systemList;
        $scope.authorList = authorList;
        $scope.distSystemList = distSystemList;

        $.ajax({
            url: 'http://redmine.ssgadm.com/redmine/users/current.json',
            type: 'get',
            dataType: 'jsonp',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            error: function(xhr, ajaxOptions, thrownError) {
                console.error('Invalid username or password. Please try again.');
            },
            success: function(result) {
                $scope.user = result.user;

                $scope.$apply();
            }
        });     

        function redmineSearch(type) {
            $.ajax({
                url: 'http://redmine.ssgadm.com/redmine/issues/' + ((type === 'task') ? $scope.task.id : $scope.sql.id) + '.json',
                type: 'get',
                dataType: 'jsonp',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                error: function(xhr, ajaxOptions, thrownError) {
                    console.error('Invalid username or password. Please try again.');
                },
                success: function(result) {
                    // console.log(result.issue);

                    if (type === 'task') {
                        $scope.task = result.issue;
                    } else {
                        $scope.sql = result.issue;
                    }

                    $scope.$apply();
                }
            });
        };

        function buildComplete() {
            $scope.buildNote.subject = $scope.task.subject;
            $scope.buildNote.assigned_to_id = $scope.user.id;
            $scope.buildNote.desc = 'h2. 개요\n\n' 
                                    + '| 요청자 | ' + $scope.task.author.name + ' |\n'
                                    + '| 기획 담당자 | ' + $scope.task.author.name + ' |\n'
                                    + '| 개발/빌드 담당 | ' + $scope.task.assigned_to.name + ' |\n'
                                    + '| 개발 기간 | ' + $scope.task.start_date + ' ~ ' + $scope.task.due_date + ' |\n'
                                    + '| QA 반영 일자 | ' + $scope.task.qa_date + ' |\n'
                                    + '| 대상 서비스 | ' + (($scope.distSystems.length > 0) ? $scope.distSystems.join(', ') : '') + ' |\n\n'
                                    + 'h2. 개발 SPEC (기능 추가 및 삭제/변경 내역)\n\n' 
                                    + '| Redmine key | #' + $scope.task.id + ' |\n'
                                    + '| 내역 | ' + $scope.task.subject + ' |\n\n'
                                    + 'h2. 기획자 테스트 요구 사항\n\n' 
                                    + '| ' + (($scope.requirements.length > 0) ? $scope.requirements.join(' |\n| ') : '') + ' |\n\n'
                                    + 'h2. 영향 받는 시스템 및 기능 (Dependency Module)\n\n' 
                                    + '| 담당자 확인 | ' + (($scope.dependency.system != null && $scope.dependency.system != '') ? '확인완료' : '') + ' |\n'
                                    + '| 시스템명 | ' + $scope.dependency.system + ' |\n'
                                    + '| 영향 받는 기능 / 영역 | ' + $scope.dependency.scope + ' |\n\n' 
                                    + 'h2. SQL 검수 완료 여부\n\n' 
                                    + '| SQL 검수 완료 확인 (.xml 소스 반영 시) | ' + (($scope.sql.id !== undefined) ? $scope.sql.status.name : '') + ' |\n'
                                    + '| SQL 검수 요청 Redmine Key | ' + (($scope.sql.id !== undefined) ? $scope.sql.id : '') + ' |\n\n'
                                    + 'h2. 소스 파일 경로\n\n' 
                                    + '| ' + (($scope.files.length > 0) ? $scope.files.join(' |\n| ') : '') + ' |\n\n'
                                    + 'h2. 배포 요구 사항\n\n' 
                                    + '| 배포 유형 | ' + $scope.distType + ' |\n'
                                    + '| QA WAR 버전 | ' + $scope.qaVersion + ' |\n'
                                    + '| 유의사항 | ' + $scope.consideration + ' |\n';
        }

        function register() {
            $http({
                url: 'http://redmine.ssgadm.com/redmine/issues.json',
                method: 'POST',
                data: {
                    "issue": {
                        "project_id": "project-0103",
                        "tracker_id": 13, // 유형-정기배포
                        "status_id": 1, // 상태-오픈
                        "priority_id": 2, // 우선순위-보통(P4)
                        "subject": $scope.buildNote.subject, // 제목
                        "description": $scope.buildNote.desc, // 설명
                        "assigned_to_id": $scope.buildNote.assigned_to_id, // 담당자
                        "custom_fields": [{
                            "id": "26",
                            "value": $scope.changeSystems // 26 변경작업시스템
                        }, {
                            "id": "29",
                            "value": $scope.requesters // 29 기획자
                        }, {
                            "id": "37",
                            "value": $scope.distSystems // 37 배포시스템
                        }, {
                            "id": "38",
                            "value": $scope.task.due_date // 38 배포일자 YYYY-MM-DD
                        }]
                    }
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).success(function(result) {
                location.href = 'http://redmine.ssgadm.com/redmine/issues/' + result.issue.id;
            }).error(function(result) {
                console.log(result);
                alert('레드마인 등록중 문제가 발생했습니다.');
            });
        }

        $('.datepicker').datepicker({
            format: "yyyy-mm-dd"
        })
        .on("changeDate", function(e) {
            $('div.datepicker').hide();
            var target = $(e.currentTarget);
            if (target.attr('id') === 'startDate') {
                $scope.task.start_date = target.val();
            } else if (target.attr('id') === 'dueDate') {
                $scope.task.due_date = target.val();
            } else {
                $scope.task.qa_date = target.val();
            }

            $scope.$apply();
        });
    }
})();