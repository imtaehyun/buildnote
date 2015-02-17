'use strict';

var app = angular.module('buildNote', []);

app.controller('BuildnoteController', ['$scope', '$http',
    function($scope, $http) {
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
            var buildNoteData = {
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
                };

            console.log(JSON.stringify(buildNoteData));

            $.ajax({
                url: 'http://redmine.ssgadm.com/redmine/issues.json',
                type: 'post',
                data: buildNoteData,
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                error: function(xhr, ajaxOptions, thrownError) {
                    console.error('Invalid username or password. Please try again.');
                },
                success: function(result) {
                    console.log(result);
                }
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
]);

var authorList = [{"id":"1058","name":"강경희(p900vp) 팀장"},{"id":"110","name":"강구일(092385) 과장"},{"id":"583","name":"강미영(133888) 주임"},{"id":"1224","name":"강민영(p901iv) 관리자"},{"id":"771","name":"강민정(502609) HyosungITX 통계"},{"id":"808","name":"강수아(140181) 주임"},{"id":"231","name":"강지은(066612) 과장"},{"id":"127","name":"강철민(121560) 대리"},{"id":"594","name":"강효정(133988) 사원"},{"id":"1195","name":"고경락(p9028n) 사원"},{"id":"862","name":"고순심(p901e2) 사원"},{"id":"813","name":"고연주(p900vw) BI UI개발"},{"id":"106","name":"고영민(081128) 과장"},{"id":"1169","name":"고효진(144880) 사원"},{"id":"651","name":"구도현(134388) 주임"},{"id":"44","name":"구지영(122890) 주임"},{"id":"58","name":"구현아(121834) 과장"},{"id":"340","name":"구효정(112495) 사원"},{"id":"791","name":"국정인(502505) Ubase SV"},{"id":"1167","name":"권병원(093153) 주임"},{"id":"175","name":"권영주(041182) 과장"},{"id":"158","name":"권율(066560) 대리"},{"id":"1093","name":"권재훈(p901to) 사원"},{"id":"565","name":"권태진(133410) 주임"},{"id":"865","name":"권희경(p901gf) 사원"},{"id":"190","name":"길준규(102659) 주임"},{"id":"1246","name":"김가영(p902v2) UI개발"},{"id":"337","name":"김강현(112490) 사원"},{"id":"702","name":"김경진(114614) 주임"},{"id":"88","name":"김광무(129845) 대리"},{"id":"460","name":"김광현(062769) 대리"},{"id":"222","name":"김기동(024389) 주임"},{"id":"410","name":"김도영(990080) 팀장"},{"id":"754","name":"김도훈(135459) 주임"},{"id":"1184","name":"김동관(502585) 김동관"},{"id":"1208","name":"김동욱(146665) 사원"},{"id":"856","name":"김명수(140883) 주임"},{"id":"810","name":"김문정(061045) 대리"},{"id":"87","name":"김미정(129844) 대리"},{"id":"863","name":"김미진(990i03) 사원"},{"id":"1050","name":"김민경(p900cz) 강사"},{"id":"212","name":"김민석(130041) 주임"},{"id":"455","name":"김민선(132473) 사원"},{"id":"806","name":"김민아(140178) 사원"},{"id":"678","name":"김민정(134616) 사원"},{"id":"254","name":"김민정(982074) 주임"},{"id":"1197","name":"김민철(145731) 주임"},{"id":"1153","name":"김병준(121958) 주임"},{"id":"311","name":"김보라(113381) 사원"},{"id":"406","name":"김보라(990H12) 팀장"},{"id":"80","name":"김상범(113417) 팀장"},{"id":"67","name":"김상연(127464) 주임"},{"id":"1218","name":"김상욱(133505) 사원"},{"id":"104","name":"김성은(124837) 주임"},{"id":"746","name":"김소라(135227) 사원"},{"id":"1193","name":"김소영(p9028q) 사원"},{"id":"1074","name":"김송의(p9007m) 사원"},{"id":"817","name":"김수원(140364) 주임"},{"id":"687","name":"김승만(041155) 과장"},{"id":"592","name":"김승아(133986) 대리"},{"id":"35","name":"김신(118567) 과장"},{"id":"743","name":"김신원(121974) 주임"},{"id":"1190","name":"김영애(502376) 사원"},{"id":"237","name":"김영조(051102) 과장"},{"id":"213","name":"김영주(130042) 주임"},{"id":"1098","name":"김예선(990z72) 강사"},{"id":"184","name":"김요셉(111232) 과장"},{"id":"793","name":"김용민(502513) Ubase SV"},{"id":"176","name":"김우정(073219) 과장"},{"id":"33","name":"김우진(112159) 과장"},{"id":"333","name":"김원민(112480) 사원"},{"id":"1063","name":"김유린(121972) 주임"},{"id":"233","name":"김윤미(081887) 사원"},{"id":"581","name":"김윤우(crewmate16) Crewmate 운영"},{"id":"763","name":"김은종(990905) HyosungITX SV"},{"id":"1052","name":"김은혜(990911) HyosungITX"},{"id":"744","name":"김은호(102701) 주임"},{"id":"784","name":"김재림(990A48) Ubase SV"},{"id":"1199","name":"김재호(145732) 사원"},{"id":"720","name":"김정선(135039) 대리"},{"id":"812","name":"김정옥(990846) HyosungITX 교육"},{"id":"1220","name":"김정현(p902j1) 관리자"},{"id":"1183","name":"김종호(145472) 주임"},{"id":"290","name":"김주영(130759) 주임"},{"id":"1095","name":"김준오(p901tq) 사원"},{"id":"129","name":"김준태(073117) 과장"},{"id":"206","name":"김지숙(114635) 과장"},{"id":"48","name":"김지영(121955) 주임"},{"id":"159","name":"김지희(041761) 대리"},{"id":"778","name":"김진경(p900hr) Ubase MG"},{"id":"163","name":"김진설(001284) 부장"},{"id":"403","name":"김진아(990879) 팀장"},{"id":"833","name":"김진아A(p9016g) Ubase SV"},{"id":"679","name":"김진영(134615) 사원"},{"id":"779","name":"김창우(502536) Ubase SV"},{"id":"477","name":"김철민(117784) 주임"},{"id":"39","name":"김하형(117983) 과장"},{"id":"160","name":"김현미(082873) 대리"},{"id":"50","name":"김현정(129830) 과장"},{"id":"34","name":"김현철(122891) 주임"},{"id":"36","name":"김형미(126345) 대리"},{"id":"136","name":"김형일(024118) 과장"},{"id":"99","name":"김형진(130539) 대리"},{"id":"593","name":"김형진(133987) 주임"},{"id":"1180","name":"김혜영(144894) 대리"},{"id":"1219","name":"김혜진(502023) 사원"},{"id":"807","name":"김호경(140180) 주임"},{"id":"386","name":"김환석(131300) 대리"},{"id":"1175","name":"김효경(144864) 대리"},{"id":"397","name":"김효정(990E41) 실장"},{"id":"855","name":"김훈(140880) 사원"},{"id":"1226","name":"김희성(p902gq) 선임"},{"id":"742","name":"김희창(135087) 대리"},{"id":"155","name":"나재민(110651) 대리"},{"id":"164","name":"남궁현(082072) 과장"},{"id":"1192","name":"남세건(p9028o) 사원"},{"id":"429","name":"남정달(131703) 과장"},{"id":"250","name":"노다은(068635) 대리"},{"id":"1160","name":"노란선(114585) 주임"},{"id":"1228","name":"류지향(502202) SV"},{"id":"264","name":"명노현(931187) 팀장"},{"id":"137","name":"문명균(071373) 대리"},{"id":"1161","name":"문형길(114448) 주임"},{"id":"318","name":"문혜인(112479) 사원"},{"id":"328","name":"민미홍(112496) 사원"},{"id":"591","name":"민지희(133989) 사원"},{"id":"138","name":"박경원(083410) 주임"},{"id":"404","name":"박경태(990H15) 팀장"},{"id":"413","name":"박경희(990848) 팀장"},{"id":"38","name":"박남현(117944) 과장"},{"id":"113","name":"박다솜(102696) 주임"},{"id":"75","name":"박문태(128518) 부장"},{"id":"85","name":"박미연(114468) 과장"},{"id":"860","name":"박미진(p9019n) Ubase"},{"id":"317","name":"박보람(112503) 사원"},{"id":"708","name":"박보람(134904) 사원"},{"id":"398","name":"박보희(990F92) 실장"},{"id":"818","name":"박상수(140363) 사원"},{"id":"1250","name":"박상준(p902yz) 사원"},{"id":"853","name":"박선욱(081837) 주임"},{"id":"357","name":"박소진(112481) 사원"},{"id":"1189","name":"박송희(p900g3) 사원"},{"id":"147","name":"박영덕(082872) 대리"},{"id":"185","name":"박영미(104580) 대리"},{"id":"367","name":"박옥규(100727) 사원"},{"id":"114","name":"박용석(062929) 대리"},{"id":"229","name":"박은진(065475) 과장"},{"id":"345","name":"박은혜(113090) 사원"},{"id":"336","name":"박인숙(112486) 사원"},{"id":"649","name":"박정용(134390) 주임"},{"id":"207","name":"박정혜(121788) 대리"},{"id":"61","name":"박정환(123063) 대리"},{"id":"822","name":"박종명(p90048) Ubase 교육"},{"id":"783","name":"박종미(990545) Ubase SV"},{"id":"224","name":"박종선(081542) 대리"},{"id":"1188","name":"박지애(p901k8) 사원"},{"id":"400","name":"박지영(990I01) 팀장"},{"id":"343","name":"박지원(112505) 사원"},{"id":"787","name":"박지이(502322) Ubase SV"},{"id":"1066","name":"박진주(073369) 대리"},{"id":"401","name":"박진희(990H13) 팀장"},{"id":"666","name":"박참샘(134508) 대리"},{"id":"408","name":"박춘희(990881) 실장"},{"id":"770","name":"박현대(502179) HyosungITX 교육"},{"id":"347","name":"박현애(932045) 주임"},{"id":"857","name":"박현호(140884) 주임"},{"id":"339","name":"박혜림(112494) 사원"},{"id":"196","name":"박혜민(130088) 주임"},{"id":"1075","name":"박혜정(p901ny) 팀장"},{"id":"86","name":"박희주(114465) 대리"},{"id":"53","name":"방수인(113792) 대리"},{"id":"223","name":"배경욱(931244) 팀장"},{"id":"786","name":"배상현(502391) Ubase SV"},{"id":"128","name":"배익(095606) 주임"},{"id":"77","name":"배정연(128825) 주임"},{"id":"785","name":"배현진(502586) Ubase SV"},{"id":"220","name":"백민성(083343) 주임"},{"id":"798","name":"백선미(502330) Ubase QA"},{"id":"395","name":"백승걸(131544) 주임"},{"id":"255","name":"백승권(921224) 팀장"},{"id":"394","name":"백영현(990834) 파트너"},{"id":"301","name":"백종혁(131003) 주임"},{"id":"1171","name":"변소희(144881) 주임"},{"id":"119","name":"변희경(112182) 대리"},{"id":"795","name":"서가영(990148) Ubase 교육"},{"id":"60","name":"서길분(121790) 과장"},{"id":"709","name":"서무교(134924) 주임"},{"id":"79","name":"서승희(117820) 주임"},{"id":"1155","name":"서정오(144195) 주임"},{"id":"139","name":"서정혜(073848) 과장"},{"id":"320","name":"서지영(130680) 사원"},{"id":"774","name":"서지혜(502628) HyosungITX 교육"},{"id":"319","name":"서형미(112492) 사원"},{"id":"240","name":"서호준(001987) 과장"},{"id":"1252","name":"석시아(p9018r) 사원"},{"id":"794","name":"석지연(502380) Ubase 교육"},{"id":"200","name":"석태미(123556) 과장"},{"id":"407","name":"선혜란(990A11) 센터장"},{"id":"1166","name":"소정섭(016227) 과장"},{"id":"1191","name":"손경자(p900c4) 사원"},{"id":"358","name":"손다희(112485) 사원"},{"id":"186","name":"손지영(081125) 과장"},{"id":"356","name":"손지혜(112489) 사원"},{"id":"170","name":"손혜선(092910) 주임"},{"id":"161","name":"송구호(083406) 주임"},{"id":"111","name":"송금아(110497) 과장"},{"id":"40","name":"송기종(072027) 과장"},{"id":"306","name":"송지숙(044607) 과장"},{"id":"168","name":"송진봉(003047) 과장"},{"id":"219","name":"송호영(083333) 대리"},{"id":"767","name":"송희정(502054) HyosungITX SV"},{"id":"342","name":"신광섭(112498) 사원"},{"id":"225","name":"신구슬(041905) 과장"},{"id":"707","name":"신다혜(134908) 사원"},{"id":"1083","name":"신선호(142923) 대리"},{"id":"821","name":"신수경(p900hv) Ubase 교육"},{"id":"259","name":"신익수(971070) 과장"},{"id":"103","name":"신정훈(117622) 과장"},{"id":"688","name":"신지예(117852) 주임"},{"id":"428","name":"신진희(131704) 대리"},{"id":"409","name":"심미영(990C27) 실장"},{"id":"74","name":"심보현(113603) 대리"},{"id":"790","name":"안재영(502360) Ubase SV"},{"id":"94","name":"양광모(130087) 사원"},{"id":"69","name":"양영열(127462) 대리"},{"id":"750","name":"양은혜(135318) 사원"},{"id":"57","name":"양진성(129787) 주임"},{"id":"1085","name":"양현숙(142924) 과장"},{"id":"42","name":"양호석(129896) 부장"},{"id":"72","name":"어승옥(130616) 주임"},{"id":"368","name":"오동석(061797) 사원"},{"id":"551","name":"오정인(133187) 대리"},{"id":"165","name":"옥경원(041733) 대리"},{"id":"201","name":"우기영(114443) 주임"},{"id":"302","name":"유설화(131004) 주임"},{"id":"1248","name":"유우직(p902uz) 사원"},{"id":"1231","name":"유은진(p901f0) 사원"},{"id":"312","name":"유제연(113380) 사원"},{"id":"66","name":"유진석(123698) 과장"},{"id":"776","name":"유진희(502902) Ubase MG"},{"id":"162","name":"유태일(011536) 과장"},{"id":"261","name":"유하리(083358) 대리"},{"id":"1154","name":"유현재(144187) 사원"},{"id":"745","name":"유호연(135127) 대리"},{"id":"772","name":"윤미라(502470) HyosungITX 교육"},{"id":"630","name":"윤미주(068640) 대리"},{"id":"391","name":"윤보라(990e57) 파트너"},{"id":"748","name":"윤승환(135224) 대리"},{"id":"1198","name":"윤예진(145733) 사원"},{"id":"782","name":"윤은경(990139) Ubase SV"},{"id":"396","name":"윤주희(131546) 사원"},{"id":"674","name":"윤희윤(134585) 주임"},{"id":"349","name":"이경숙(942564) 사원"},{"id":"308","name":"이경택(131084) 대리"},{"id":"412","name":"이계연(990406) 팀장"},{"id":"479","name":"이광욱(132894) 대리"},{"id":"788","name":"이금실(502502) Ubase SV"},{"id":"151","name":"이기원(091493) 주임"},{"id":"191","name":"이나영(085497) 주임"},{"id":"364","name":"이나희(105456) 사원"},{"id":"673","name":"이동수(134586) 대리"},{"id":"781","name":"이동영(990a54) Ubase SV"},{"id":"417","name":"이동희(990826) 팀장"},{"id":"696","name":"이명규(p900ie) 사원"},{"id":"63","name":"이미란(115627) 주임"},{"id":"1068","name":"이미지(p9001o) 선임"},{"id":"1092","name":"이민국(502526) 팀장"},{"id":"260","name":"이상욱(072634) 대리"},{"id":"363","name":"이상주(912125) 대리"},{"id":"244","name":"이상훈(051109) 대리"},{"id":"117","name":"이상희(111234) 과장"},{"id":"765","name":"이서윤(502178) HyosungITX SV"},{"id":"468","name":"이석찬(990355) 팀장"},{"id":"1056","name":"이소라(p901cn) Ubase "},{"id":"586","name":"이수인(133894) 사원"},{"id":"330","name":"이시은(112504) 사원"},{"id":"249","name":"이신우(068630) 대리"},{"id":"208","name":"이영민(121787) 주임"},{"id":"1065","name":"이예중(116438) 주임"},{"id":"228","name":"이용석(043076) 과장"},{"id":"1253","name":"이윤형(p902uy) 담당"},{"id":"55","name":"이은수(125220) 대리"},{"id":"37","name":"이은주(110650) 부장"},{"id":"414","name":"이은주(990887) 팀장"},{"id":"329","name":"이은희(112500) 사원"},{"id":"140","name":"이장한(072782) 과장"},{"id":"467","name":"이재선(132780) 주임"},{"id":"411","name":"이재영(990633) 팀장"},{"id":"166","name":"이재은(052733) 대리"},{"id":"64","name":"이재진(120737) 대리"},{"id":"359","name":"이정민(100156) 사원"},{"id":"124","name":"이정민(111696) 주임"},{"id":"83","name":"이정아(114466) 과장"},{"id":"172","name":"이정재(081709) 부장"},{"id":"764","name":"이정재(502821) HyosungITX SV"},{"id":"392","name":"이정훈(062768) 대리"},{"id":"263","name":"이종수(971470) 팀장"},{"id":"46","name":"이종철(032784) 부장"},{"id":"820","name":"이지혜(990F26) Ubase 교육"},{"id":"415","name":"이진아(990245) 팀장"},{"id":"681","name":"이진원(021934) 과장"},{"id":"334","name":"이진주(112482) 사원"},{"id":"773","name":"이진향(502051) HyosungITX 교육"},{"id":"625","name":"이진형(117787) 주임"},{"id":"238","name":"이창준(941452) 팀장"},{"id":"650","name":"이채영(134389) 사원"},{"id":"1223","name":"이한솔(p901xr) 관리자"},{"id":"221","name":"이현도(991299) 대리"},{"id":"45","name":"이현숙(122883) 주임"},{"id":"826","name":"이현주(chobit45) Crewmate 운영"},{"id":"747","name":"이현지(135225) 사원"},{"id":"271","name":"이형석(011257) 대리"},{"id":"1240","name":"이형호(990Z54) 팀장"},{"id":"199","name":"이혜영(123996) 대리"},{"id":"789","name":"이혜정(990B50) Ubase SV"},{"id":"272","name":"이혜진(951479) 부장"},{"id":"1064","name":"이화현(074349) 대리"},{"id":"59","name":"이훈구(116039) 주임"},{"id":"1185","name":"인치은(121977) 주임"},{"id":"251","name":"임유정(068636) 대리"},{"id":"341","name":"임정선(112497) 사원"},{"id":"192","name":"임정은(114605) 주임"},{"id":"150","name":"임춘덕(083408) 주임"},{"id":"809","name":"임태현(140179) 사원"},{"id":"365","name":"임효진(105459) 사원"},{"id":"118","name":"장경민(112180) 대리"},{"id":"758","name":"장동혁(p900jw) HyosungITX 센터장"},{"id":"1201","name":"장미(145735) 사원"},{"id":"122","name":"장미정(111695) 주임"},{"id":"294","name":"장서윤(130841) 과장"},{"id":"590","name":"장수연(133990) 사원"},{"id":"761","name":"장슬아(502113) HyosungITX SV"},{"id":"142","name":"장영덕(085182) 과장"},{"id":"105","name":"장영복(961062) 과장"},{"id":"1152","name":"장정화(p901vr) 사원"},{"id":"173","name":"장지철(085012) 과장"},{"id":"346","name":"장진경(113091) 사원"},{"id":"1227","name":"장진원(p902jt) MG"},{"id":"1230","name":"장진희(p902km) 장진희"},{"id":"273","name":"장환(961487) 팀장"},{"id":"1072","name":"전보솔(142348) 사원"},{"id":"399","name":"전선미(990494) 팀장"},{"id":"393","name":"전영규(131326) 주임"},{"id":"115","name":"전치운(102703) 주임"},{"id":"242","name":"전현탁(991708) 과장"},{"id":"1055","name":"정길호(502544) Ubase "},{"id":"188","name":"정동구(102679) 주임"},{"id":"430","name":"정병영(131702) 주임"},{"id":"819","name":"정보람(990G77) Ubase 교육"},{"id":"1213","name":"정성래(116447) 주임"},{"id":"458","name":"정소연(132520) 주임"},{"id":"1090","name":"정숙경(502328) 팀장"},{"id":"125","name":"정승훈(111697) 대리"},{"id":"270","name":"정연희(972553) 주임"},{"id":"121","name":"정영민(112645) 대리"},{"id":"154","name":"정영재(081402) 과장"},{"id":"267","name":"정원태(001322) 과장"},{"id":"623","name":"정윤연(011236) 대리"},{"id":"457","name":"정은경(132471) 대리"},{"id":"1173","name":"정인혁(144858) 주임"},{"id":"796","name":"정현숙(502340) Ubase QA"},{"id":"797","name":"정혜주(502311) Ubase QA"},{"id":"1222","name":"정혜주(p902fb) 관리자"},{"id":"1084","name":"조민경(142909) 주임"},{"id":"130","name":"조선영(092050) 주임"},{"id":"76","name":"조선영(117821) 주임"},{"id":"769","name":"조선희(990129) HyosungITX SV"},{"id":"183","name":"조성현(110511) 과장"},{"id":"418","name":"조승열(990F10) 팀장"},{"id":"1094","name":"조우상(p901tp) 사원"},{"id":"572","name":"조윤경(043612) 과장"},{"id":"1244","name":"조은영(117812) 사원"},{"id":"133","name":"조재광(095000) 과장"},{"id":"84","name":"조정미(114464) 과장"},{"id":"405","name":"조정아(990609) 팀장"},{"id":"1178","name":"조진경(p90213) 조진경"},{"id":"1086","name":"조진영(142907) 주임"},{"id":"459","name":"조혜미(132519) 대리"},{"id":"668","name":"지승현(074337) 주임"},{"id":"1089","name":"지제민(502297) 팀장"},{"id":"697","name":"진현수(990h55) 사원"},{"id":"814","name":"최다정(p900vx) UI개발"},{"id":"236","name":"최덕선(991760) 팀장"},{"id":"1249","name":"최민성(p902xu) UI개발"},{"id":"174","name":"최성찬(015355) 대리"},{"id":"1165","name":"최수지(p9019l) 사원"},{"id":"1200","name":"최시원(145734) 주임"},{"id":"178","name":"최우정(105905) 부사장보"},{"id":"227","name":"최익호(023405) 과장"},{"id":"792","name":"최종우(990952) Ubase SV"},{"id":"859","name":"최준영(140881) 사원"},{"id":"143","name":"최지훈(091492) 대리"},{"id":"41","name":"최태훈(126220) 주임"},{"id":"1069","name":"최현우(142381) 대리"},{"id":"780","name":"최혜진(990730) Ubase SV"},{"id":"1221","name":"최혜진(p902j0) 관리자"},{"id":"331","name":"최호영(025067) 사원"},{"id":"1163","name":"최홍기(144112) 대리"},{"id":"144","name":"최희영(062381) 과장"},{"id":"768","name":"최희영(502148) HyosungITX SV"},{"id":"243","name":"최희준(095594) 주임"},{"id":"230","name":"탁현숙(066588) 과장"},{"id":"54","name":"표상순(122484) 대리"},{"id":"145","name":"하걸범(093087) 주임"},{"id":"1245","name":"하민정(114581) 사원"},{"id":"134","name":"하영실(095002) 대리"},{"id":"258","name":"한건수(991742) 과장"},{"id":"52","name":"한동훈(116948) 부장"},{"id":"146","name":"한명식(066273) 과장"},{"id":"351","name":"한미애(112499) 사원"},{"id":"1225","name":"한미영(p9000h) 관리자"},{"id":"759","name":"한정순(502173) HyosungITX MG"},{"id":"248","name":"한혜원(095597) 주임"},{"id":"1082","name":"함선희(p900jm) 사원"},{"id":"43","name":"허준(125379) 팀장"},{"id":"203","name":"허진영(114586) 주임"},{"id":"1241","name":"홍보람(990C25) 팀장"},{"id":"177","name":"홍상연(068639) 대리"},{"id":"1174","name":"홍성범(144859) 주임"},{"id":"1097","name":"홍순길(p901tn) 사원"},{"id":"338","name":"홍아름(112491) 사원"},{"id":"116","name":"홍준표(110628) 과장"},{"id":"65","name":"홍지선(123697) 주임"},{"id":"362","name":"황보소영(112493) 사원"},{"id":"560","name":"황성철(133363) 대리"},{"id":"189","name":"황인혁(102684) 주임"}];
var systemList = ["ssg-batch-app", "ssg-bo-webapp", "ssg-ecms-webapp", "ssg-pco-webapp", "ssg-pdo-webapp", "ssg-po-webapp", "ssg-cso-webapp", "ssg-eapi-webapp", "ssg-mapi-webapp", "ssg-uapi-webapp", "ssg-capi-webapp", "ssg-event-webapp", "ssg-emart-webapp", "ssg-boons-webapp", "ssg-traders-webapp", "ssg-memall-webapp", "ssg-mtraders-webapp", "ssg-msmall-webapp", "ssg-mlguplus-webapp", "ssg-mssgmall-webapp", "ssg-member-webapp", "ssg-pay-webapp", "ssg-mmember-webapp", "ssg-mpay-webapp", "ssg-department-webapp", "ssg-small-webapp", "ssg-ssgmall-webapp", "ssg-ssgli-webapp", "ssg-redirect-webapp", "pg-api-webapp", "pg-batch", "pg-bo-webapp", "pg-www-webapp", "ssg-bo-library", "ssg-common-library", "ssg-emall-library", "ssg-framework-support", "ssg-instant.win-library", "ssg-member-library", "ssg-mileage-library", "ssg-pay-library", "ssg-pd-library", "ssg-search-library", "ssg-shorturl-library", "ssg-small-library", "ssg-ssgmall-library", "ssg-uapi.client-library", "ssg-media-webapp-image", "ssg-media-webapp-purge"];
var distSystemList = ["데이터", "프론트PC ALL", "프론트Mobile ALL", "백엔드 ALL", "SSG", "mSSG", "신세계몰", "신세계백화점", "m신세계몰", "mlguplus", "이마트몰", "트레이더스", "분스", "m이마트몰", "m트레이더스", "SSG - android APP", "신세계몰 - android APP", "이마트몰 - android APP", "SSG - ios phone APP", "신세계몰 - ios phone APP", "이마트몰 - ios phone APP", "SSG - ios pad APP", "신세계몰 - ios pad APP", "이마트몰 - ios pad APP", "가상스토어 - android APP", "가상스토어 - ios phone APP", "가상스토어 - ios pad APP", "SFC - android APP", "SFC - ios phone APP", "SFC - ios pad APP", "이벤트", "member", "mmember", "pay", "mpay", "LI", "BO", "PO", "PDO", "PCO", "CSO", "ECMS", "eAPI", "cAPI", "mAPI", "uAPI", "batch", "media", "purge", "PG_프론트", "PG_BO", "PG_API"];