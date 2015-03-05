<<<<<<< HEAD
'use strict';

var app = angular.module('buildNote', []);

app.controller('BuildNoteGeneratorController', ['$scope', '$http',
    function($scope, $http) {
        $scope.buildNote = {};
        $scope.buildNote.task = {};
        $scope.buildNote.sql = {};
        $scope.systemList = systemList;
        $scope.authorList = authorList;
        $scope.buildNote.changeSystem = new Array();
        
        $scope.buildNote.task.id = '106415';
        $scope.buildNote.sql.id = '106415';

        $scope.redmineSearch = function(type) {
            $.ajax({                
                url: 'http://redmine.ssgadm.com/redmine/issues/' + ((type === 'task') ? $scope.buildNote.task.id : $scope.buildNote.sql.id) + '.json',
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
                    console.log(result.issue);
                    result.issue.author.name = result.issue.author.name.replace(/\([0-9]*\)/g, '');
                    result.issue.assigned_to.name = result.issue.assigned_to.name.replace(/\([0-9]*\)/g, '');
                    
                    if (type === 'task') {
                        $scope.buildNote.task = result.issue;
                    } else {
                        $scope.buildNote.sql = result.issue;
                    }
                    
                    $scope.$apply();
                }
            });
        };

        $scope.complete = function() {
            $scope.buildNote.distType = $('input[name=distType]').val();
        	complete();
        }
        
        $scope.addChangeSystem = function(system) {
            if ($scope.buildNote.changeSystem.indexOf(system) < 0)  {
                $scope.buildNote.changeSystem.push(system);

                console.log(system + ' added');
            }
            console.log($scope.buildNote.changeSystem);
        }
        
        $scope.deleteChangeSystem = function(system) {
            $scope.buildNote.changeSystem.splice($scope.buildNote.changeSystem.indexOf(system), 1);

            console.log(system + ' deleted');
            console.log($scope.buildNote.changeSystem);
        };

        $('.datepicker').datepicker({
            format: "yyyy-mm-dd"
        })
        .on("changeDate", function(e) {
            $('div.datepicker').hide();
            var target = $(e.currentTarget);
            if (target.attr('id') === 'startDate') {
                $scope.buildNote.task.start_date = target.val();
            } else if (target.attr('id') === 'dueDate') {
                $scope.buildNote.task.due_date = target.val();
            } else {
                $scope.buildNote.qa_date = target.val();    
            }
            
            $scope.$apply();
        });
    }
]);

function complete() {
	$('.ui.modal').modal('show');
}

$(function() {
    $('.ui.dropdown').dropdown();
    $('.ui.checkbox').checkbox();
    $('.ui.radio.checkbox').checkbox();
});

var authorList = [{"no":"1058","name":"강경희(p900vp) 팀장"},{"no":"110","name":"강구일(092385) 과장"},{"no":"583","name":"강미영(133888) 주임"},{"no":"1224","name":"강민영(p901iv) 관리자"},{"no":"771","name":"강민정(502609) HyosungITX 통계"},{"no":"808","name":"강수아(140181) 주임"},{"no":"231","name":"강지은(066612) 과장"},{"no":"127","name":"강철민(121560) 대리"},{"no":"594","name":"강효정(133988) 사원"},{"no":"1195","name":"고경락(p9028n) 사원"},{"no":"862","name":"고순심(p901e2) 사원"},{"no":"813","name":"고연주(p900vw) BI UI개발"},{"no":"106","name":"고영민(081128) 과장"},{"no":"1169","name":"고효진(144880) 사원"},{"no":"651","name":"구도현(134388) 주임"},{"no":"44","name":"구지영(122890) 주임"},{"no":"58","name":"구현아(121834) 과장"},{"no":"340","name":"구효정(112495) 사원"},{"no":"791","name":"국정인(502505) Ubase SV"},{"no":"1167","name":"권병원(093153) 주임"},{"no":"175","name":"권영주(041182) 과장"},{"no":"158","name":"권율(066560) 대리"},{"no":"1093","name":"권재훈(p901to) 사원"},{"no":"565","name":"권태진(133410) 주임"},{"no":"865","name":"권희경(p901gf) 사원"},{"no":"190","name":"길준규(102659) 주임"},{"no":"1246","name":"김가영(p902v2) UI개발"},{"no":"337","name":"김강현(112490) 사원"},{"no":"702","name":"김경진(114614) 주임"},{"no":"88","name":"김광무(129845) 대리"},{"no":"460","name":"김광현(062769) 대리"},{"no":"222","name":"김기동(024389) 주임"},{"no":"410","name":"김도영(990080) 팀장"},{"no":"754","name":"김도훈(135459) 주임"},{"no":"1184","name":"김동관(502585) 김동관"},{"no":"1208","name":"김동욱(146665) 사원"},{"no":"856","name":"김명수(140883) 주임"},{"no":"810","name":"김문정(061045) 대리"},{"no":"87","name":"김미정(129844) 대리"},{"no":"863","name":"김미진(990i03) 사원"},{"no":"1050","name":"김민경(p900cz) 강사"},{"no":"212","name":"김민석(130041) 주임"},{"no":"455","name":"김민선(132473) 사원"},{"no":"806","name":"김민아(140178) 사원"},{"no":"678","name":"김민정(134616) 사원"},{"no":"254","name":"김민정(982074) 주임"},{"no":"1197","name":"김민철(145731) 주임"},{"no":"1153","name":"김병준(121958) 주임"},{"no":"311","name":"김보라(113381) 사원"},{"no":"406","name":"김보라(990H12) 팀장"},{"no":"80","name":"김상범(113417) 팀장"},{"no":"67","name":"김상연(127464) 주임"},{"no":"1218","name":"김상욱(133505) 사원"},{"no":"104","name":"김성은(124837) 주임"},{"no":"746","name":"김소라(135227) 사원"},{"no":"1193","name":"김소영(p9028q) 사원"},{"no":"1074","name":"김송의(p9007m) 사원"},{"no":"817","name":"김수원(140364) 주임"},{"no":"687","name":"김승만(041155) 과장"},{"no":"592","name":"김승아(133986) 대리"},{"no":"35","name":"김신(118567) 과장"},{"no":"743","name":"김신원(121974) 주임"},{"no":"1190","name":"김영애(502376) 사원"},{"no":"237","name":"김영조(051102) 과장"},{"no":"213","name":"김영주(130042) 주임"},{"no":"1098","name":"김예선(990z72) 강사"},{"no":"184","name":"김요셉(111232) 과장"},{"no":"793","name":"김용민(502513) Ubase SV"},{"no":"176","name":"김우정(073219) 과장"},{"no":"33","name":"김우진(112159) 과장"},{"no":"333","name":"김원민(112480) 사원"},{"no":"1063","name":"김유린(121972) 주임"},{"no":"233","name":"김윤미(081887) 사원"},{"no":"581","name":"김윤우(crewmate16) Crewmate 운영"},{"no":"763","name":"김은종(990905) HyosungITX SV"},{"no":"1052","name":"김은혜(990911) HyosungITX"},{"no":"744","name":"김은호(102701) 주임"},{"no":"784","name":"김재림(990A48) Ubase SV"},{"no":"1199","name":"김재호(145732) 사원"},{"no":"720","name":"김정선(135039) 대리"},{"no":"812","name":"김정옥(990846) HyosungITX 교육"},{"no":"1220","name":"김정현(p902j1) 관리자"},{"no":"1183","name":"김종호(145472) 주임"},{"no":"290","name":"김주영(130759) 주임"},{"no":"1095","name":"김준오(p901tq) 사원"},{"no":"129","name":"김준태(073117) 과장"},{"no":"206","name":"김지숙(114635) 과장"},{"no":"48","name":"김지영(121955) 주임"},{"no":"159","name":"김지희(041761) 대리"},{"no":"778","name":"김진경(p900hr) Ubase MG"},{"no":"163","name":"김진설(001284) 부장"},{"no":"403","name":"김진아(990879) 팀장"},{"no":"833","name":"김진아A(p9016g) Ubase SV"},{"no":"679","name":"김진영(134615) 사원"},{"no":"779","name":"김창우(502536) Ubase SV"},{"no":"477","name":"김철민(117784) 주임"},{"no":"39","name":"김하형(117983) 과장"},{"no":"160","name":"김현미(082873) 대리"},{"no":"50","name":"김현정(129830) 과장"},{"no":"34","name":"김현철(122891) 주임"},{"no":"36","name":"김형미(126345) 대리"},{"no":"136","name":"김형일(024118) 과장"},{"no":"99","name":"김형진(130539) 대리"},{"no":"593","name":"김형진(133987) 주임"},{"no":"1180","name":"김혜영(144894) 대리"},{"no":"1219","name":"김혜진(502023) 사원"},{"no":"807","name":"김호경(140180) 주임"},{"no":"386","name":"김환석(131300) 대리"},{"no":"1175","name":"김효경(144864) 대리"},{"no":"397","name":"김효정(990E41) 실장"},{"no":"855","name":"김훈(140880) 사원"},{"no":"1226","name":"김희성(p902gq) 선임"},{"no":"742","name":"김희창(135087) 대리"},{"no":"155","name":"나재민(110651) 대리"},{"no":"164","name":"남궁현(082072) 과장"},{"no":"1192","name":"남세건(p9028o) 사원"},{"no":"429","name":"남정달(131703) 과장"},{"no":"250","name":"노다은(068635) 대리"},{"no":"1160","name":"노란선(114585) 주임"},{"no":"1228","name":"류지향(502202) SV"},{"no":"264","name":"명노현(931187) 팀장"},{"no":"137","name":"문명균(071373) 대리"},{"no":"1161","name":"문형길(114448) 주임"},{"no":"318","name":"문혜인(112479) 사원"},{"no":"328","name":"민미홍(112496) 사원"},{"no":"591","name":"민지희(133989) 사원"},{"no":"138","name":"박경원(083410) 주임"},{"no":"404","name":"박경태(990H15) 팀장"},{"no":"413","name":"박경희(990848) 팀장"},{"no":"38","name":"박남현(117944) 과장"},{"no":"113","name":"박다솜(102696) 주임"},{"no":"75","name":"박문태(128518) 부장"},{"no":"85","name":"박미연(114468) 과장"},{"no":"860","name":"박미진(p9019n) Ubase"},{"no":"317","name":"박보람(112503) 사원"},{"no":"708","name":"박보람(134904) 사원"},{"no":"398","name":"박보희(990F92) 실장"},{"no":"818","name":"박상수(140363) 사원"},{"no":"1250","name":"박상준(p902yz) 사원"},{"no":"853","name":"박선욱(081837) 주임"},{"no":"357","name":"박소진(112481) 사원"},{"no":"1189","name":"박송희(p900g3) 사원"},{"no":"147","name":"박영덕(082872) 대리"},{"no":"185","name":"박영미(104580) 대리"},{"no":"367","name":"박옥규(100727) 사원"},{"no":"114","name":"박용석(062929) 대리"},{"no":"229","name":"박은진(065475) 과장"},{"no":"345","name":"박은혜(113090) 사원"},{"no":"336","name":"박인숙(112486) 사원"},{"no":"649","name":"박정용(134390) 주임"},{"no":"207","name":"박정혜(121788) 대리"},{"no":"61","name":"박정환(123063) 대리"},{"no":"822","name":"박종명(p90048) Ubase 교육"},{"no":"783","name":"박종미(990545) Ubase SV"},{"no":"224","name":"박종선(081542) 대리"},{"no":"1188","name":"박지애(p901k8) 사원"},{"no":"400","name":"박지영(990I01) 팀장"},{"no":"343","name":"박지원(112505) 사원"},{"no":"787","name":"박지이(502322) Ubase SV"},{"no":"1066","name":"박진주(073369) 대리"},{"no":"401","name":"박진희(990H13) 팀장"},{"no":"666","name":"박참샘(134508) 대리"},{"no":"408","name":"박춘희(990881) 실장"},{"no":"770","name":"박현대(502179) HyosungITX 교육"},{"no":"347","name":"박현애(932045) 주임"},{"no":"857","name":"박현호(140884) 주임"},{"no":"339","name":"박혜림(112494) 사원"},{"no":"196","name":"박혜민(130088) 주임"},{"no":"1075","name":"박혜정(p901ny) 팀장"},{"no":"86","name":"박희주(114465) 대리"},{"no":"53","name":"방수인(113792) 대리"},{"no":"223","name":"배경욱(931244) 팀장"},{"no":"786","name":"배상현(502391) Ubase SV"},{"no":"128","name":"배익(095606) 주임"},{"no":"77","name":"배정연(128825) 주임"},{"no":"785","name":"배현진(502586) Ubase SV"},{"no":"220","name":"백민성(083343) 주임"},{"no":"798","name":"백선미(502330) Ubase QA"},{"no":"395","name":"백승걸(131544) 주임"},{"no":"255","name":"백승권(921224) 팀장"},{"no":"394","name":"백영현(990834) 파트너"},{"no":"301","name":"백종혁(131003) 주임"},{"no":"1171","name":"변소희(144881) 주임"},{"no":"119","name":"변희경(112182) 대리"},{"no":"795","name":"서가영(990148) Ubase 교육"},{"no":"60","name":"서길분(121790) 과장"},{"no":"709","name":"서무교(134924) 주임"},{"no":"79","name":"서승희(117820) 주임"},{"no":"1155","name":"서정오(144195) 주임"},{"no":"139","name":"서정혜(073848) 과장"},{"no":"320","name":"서지영(130680) 사원"},{"no":"774","name":"서지혜(502628) HyosungITX 교육"},{"no":"319","name":"서형미(112492) 사원"},{"no":"240","name":"서호준(001987) 과장"},{"no":"1252","name":"석시아(p9018r) 사원"},{"no":"794","name":"석지연(502380) Ubase 교육"},{"no":"200","name":"석태미(123556) 과장"},{"no":"407","name":"선혜란(990A11) 센터장"},{"no":"1166","name":"소정섭(016227) 과장"},{"no":"1191","name":"손경자(p900c4) 사원"},{"no":"358","name":"손다희(112485) 사원"},{"no":"186","name":"손지영(081125) 과장"},{"no":"356","name":"손지혜(112489) 사원"},{"no":"170","name":"손혜선(092910) 주임"},{"no":"161","name":"송구호(083406) 주임"},{"no":"111","name":"송금아(110497) 과장"},{"no":"40","name":"송기종(072027) 과장"},{"no":"306","name":"송지숙(044607) 과장"},{"no":"168","name":"송진봉(003047) 과장"},{"no":"219","name":"송호영(083333) 대리"},{"no":"767","name":"송희정(502054) HyosungITX SV"},{"no":"342","name":"신광섭(112498) 사원"},{"no":"225","name":"신구슬(041905) 과장"},{"no":"707","name":"신다혜(134908) 사원"},{"no":"1083","name":"신선호(142923) 대리"},{"no":"821","name":"신수경(p900hv) Ubase 교육"},{"no":"259","name":"신익수(971070) 과장"},{"no":"103","name":"신정훈(117622) 과장"},{"no":"688","name":"신지예(117852) 주임"},{"no":"428","name":"신진희(131704) 대리"},{"no":"409","name":"심미영(990C27) 실장"},{"no":"74","name":"심보현(113603) 대리"},{"no":"790","name":"안재영(502360) Ubase SV"},{"no":"94","name":"양광모(130087) 사원"},{"no":"69","name":"양영열(127462) 대리"},{"no":"750","name":"양은혜(135318) 사원"},{"no":"57","name":"양진성(129787) 주임"},{"no":"1085","name":"양현숙(142924) 과장"},{"no":"42","name":"양호석(129896) 부장"},{"no":"72","name":"어승옥(130616) 주임"},{"no":"368","name":"오동석(061797) 사원"},{"no":"551","name":"오정인(133187) 대리"},{"no":"165","name":"옥경원(041733) 대리"},{"no":"201","name":"우기영(114443) 주임"},{"no":"302","name":"유설화(131004) 주임"},{"no":"1248","name":"유우직(p902uz) 사원"},{"no":"1231","name":"유은진(p901f0) 사원"},{"no":"312","name":"유제연(113380) 사원"},{"no":"66","name":"유진석(123698) 과장"},{"no":"776","name":"유진희(502902) Ubase MG"},{"no":"162","name":"유태일(011536) 과장"},{"no":"261","name":"유하리(083358) 대리"},{"no":"1154","name":"유현재(144187) 사원"},{"no":"745","name":"유호연(135127) 대리"},{"no":"772","name":"윤미라(502470) HyosungITX 교육"},{"no":"630","name":"윤미주(068640) 대리"},{"no":"391","name":"윤보라(990e57) 파트너"},{"no":"748","name":"윤승환(135224) 대리"},{"no":"1198","name":"윤예진(145733) 사원"},{"no":"782","name":"윤은경(990139) Ubase SV"},{"no":"396","name":"윤주희(131546) 사원"},{"no":"674","name":"윤희윤(134585) 주임"},{"no":"349","name":"이경숙(942564) 사원"},{"no":"308","name":"이경택(131084) 대리"},{"no":"412","name":"이계연(990406) 팀장"},{"no":"479","name":"이광욱(132894) 대리"},{"no":"788","name":"이금실(502502) Ubase SV"},{"no":"151","name":"이기원(091493) 주임"},{"no":"191","name":"이나영(085497) 주임"},{"no":"364","name":"이나희(105456) 사원"},{"no":"673","name":"이동수(134586) 대리"},{"no":"781","name":"이동영(990a54) Ubase SV"},{"no":"417","name":"이동희(990826) 팀장"},{"no":"696","name":"이명규(p900ie) 사원"},{"no":"63","name":"이미란(115627) 주임"},{"no":"1068","name":"이미지(p9001o) 선임"},{"no":"1092","name":"이민국(502526) 팀장"},{"no":"260","name":"이상욱(072634) 대리"},{"no":"363","name":"이상주(912125) 대리"},{"no":"244","name":"이상훈(051109) 대리"},{"no":"117","name":"이상희(111234) 과장"},{"no":"765","name":"이서윤(502178) HyosungITX SV"},{"no":"468","name":"이석찬(990355) 팀장"},{"no":"1056","name":"이소라(p901cn) Ubase "},{"no":"586","name":"이수인(133894) 사원"},{"no":"330","name":"이시은(112504) 사원"},{"no":"249","name":"이신우(068630) 대리"},{"no":"208","name":"이영민(121787) 주임"},{"no":"1065","name":"이예중(116438) 주임"},{"no":"228","name":"이용석(043076) 과장"},{"no":"1253","name":"이윤형(p902uy) 담당"},{"no":"55","name":"이은수(125220) 대리"},{"no":"37","name":"이은주(110650) 부장"},{"no":"414","name":"이은주(990887) 팀장"},{"no":"329","name":"이은희(112500) 사원"},{"no":"140","name":"이장한(072782) 과장"},{"no":"467","name":"이재선(132780) 주임"},{"no":"411","name":"이재영(990633) 팀장"},{"no":"166","name":"이재은(052733) 대리"},{"no":"64","name":"이재진(120737) 대리"},{"no":"359","name":"이정민(100156) 사원"},{"no":"124","name":"이정민(111696) 주임"},{"no":"83","name":"이정아(114466) 과장"},{"no":"172","name":"이정재(081709) 부장"},{"no":"764","name":"이정재(502821) HyosungITX SV"},{"no":"392","name":"이정훈(062768) 대리"},{"no":"263","name":"이종수(971470) 팀장"},{"no":"46","name":"이종철(032784) 부장"},{"no":"820","name":"이지혜(990F26) Ubase 교육"},{"no":"415","name":"이진아(990245) 팀장"},{"no":"681","name":"이진원(021934) 과장"},{"no":"334","name":"이진주(112482) 사원"},{"no":"773","name":"이진향(502051) HyosungITX 교육"},{"no":"625","name":"이진형(117787) 주임"},{"no":"238","name":"이창준(941452) 팀장"},{"no":"650","name":"이채영(134389) 사원"},{"no":"1223","name":"이한솔(p901xr) 관리자"},{"no":"221","name":"이현도(991299) 대리"},{"no":"45","name":"이현숙(122883) 주임"},{"no":"826","name":"이현주(chobit45) Crewmate 운영"},{"no":"747","name":"이현지(135225) 사원"},{"no":"271","name":"이형석(011257) 대리"},{"no":"1240","name":"이형호(990Z54) 팀장"},{"no":"199","name":"이혜영(123996) 대리"},{"no":"789","name":"이혜정(990B50) Ubase SV"},{"no":"272","name":"이혜진(951479) 부장"},{"no":"1064","name":"이화현(074349) 대리"},{"no":"59","name":"이훈구(116039) 주임"},{"no":"1185","name":"인치은(121977) 주임"},{"no":"251","name":"임유정(068636) 대리"},{"no":"341","name":"임정선(112497) 사원"},{"no":"192","name":"임정은(114605) 주임"},{"no":"150","name":"임춘덕(083408) 주임"},{"no":"809","name":"임태현(140179) 사원"},{"no":"365","name":"임효진(105459) 사원"},{"no":"118","name":"장경민(112180) 대리"},{"no":"758","name":"장동혁(p900jw) HyosungITX 센터장"},{"no":"1201","name":"장미(145735) 사원"},{"no":"122","name":"장미정(111695) 주임"},{"no":"294","name":"장서윤(130841) 과장"},{"no":"590","name":"장수연(133990) 사원"},{"no":"761","name":"장슬아(502113) HyosungITX SV"},{"no":"142","name":"장영덕(085182) 과장"},{"no":"105","name":"장영복(961062) 과장"},{"no":"1152","name":"장정화(p901vr) 사원"},{"no":"173","name":"장지철(085012) 과장"},{"no":"346","name":"장진경(113091) 사원"},{"no":"1227","name":"장진원(p902jt) MG"},{"no":"1230","name":"장진희(p902km) 장진희"},{"no":"273","name":"장환(961487) 팀장"},{"no":"1072","name":"전보솔(142348) 사원"},{"no":"399","name":"전선미(990494) 팀장"},{"no":"393","name":"전영규(131326) 주임"},{"no":"115","name":"전치운(102703) 주임"},{"no":"242","name":"전현탁(991708) 과장"},{"no":"1055","name":"정길호(502544) Ubase "},{"no":"188","name":"정동구(102679) 주임"},{"no":"430","name":"정병영(131702) 주임"},{"no":"819","name":"정보람(990G77) Ubase 교육"},{"no":"1213","name":"정성래(116447) 주임"},{"no":"458","name":"정소연(132520) 주임"},{"no":"1090","name":"정숙경(502328) 팀장"},{"no":"125","name":"정승훈(111697) 대리"},{"no":"270","name":"정연희(972553) 주임"},{"no":"121","name":"정영민(112645) 대리"},{"no":"154","name":"정영재(081402) 과장"},{"no":"267","name":"정원태(001322) 과장"},{"no":"623","name":"정윤연(011236) 대리"},{"no":"457","name":"정은경(132471) 대리"},{"no":"1173","name":"정인혁(144858) 주임"},{"no":"796","name":"정현숙(502340) Ubase QA"},{"no":"797","name":"정혜주(502311) Ubase QA"},{"no":"1222","name":"정혜주(p902fb) 관리자"},{"no":"1084","name":"조민경(142909) 주임"},{"no":"130","name":"조선영(092050) 주임"},{"no":"76","name":"조선영(117821) 주임"},{"no":"769","name":"조선희(990129) HyosungITX SV"},{"no":"183","name":"조성현(110511) 과장"},{"no":"418","name":"조승열(990F10) 팀장"},{"no":"1094","name":"조우상(p901tp) 사원"},{"no":"572","name":"조윤경(043612) 과장"},{"no":"1244","name":"조은영(117812) 사원"},{"no":"133","name":"조재광(095000) 과장"},{"no":"84","name":"조정미(114464) 과장"},{"no":"405","name":"조정아(990609) 팀장"},{"no":"1178","name":"조진경(p90213) 조진경"},{"no":"1086","name":"조진영(142907) 주임"},{"no":"459","name":"조혜미(132519) 대리"},{"no":"668","name":"지승현(074337) 주임"},{"no":"1089","name":"지제민(502297) 팀장"},{"no":"697","name":"진현수(990h55) 사원"},{"no":"814","name":"최다정(p900vx) UI개발"},{"no":"236","name":"최덕선(991760) 팀장"},{"no":"1249","name":"최민성(p902xu) UI개발"},{"no":"174","name":"최성찬(015355) 대리"},{"no":"1165","name":"최수지(p9019l) 사원"},{"no":"1200","name":"최시원(145734) 주임"},{"no":"178","name":"최우정(105905) 부사장보"},{"no":"227","name":"최익호(023405) 과장"},{"no":"792","name":"최종우(990952) Ubase SV"},{"no":"859","name":"최준영(140881) 사원"},{"no":"143","name":"최지훈(091492) 대리"},{"no":"41","name":"최태훈(126220) 주임"},{"no":"1069","name":"최현우(142381) 대리"},{"no":"780","name":"최혜진(990730) Ubase SV"},{"no":"1221","name":"최혜진(p902j0) 관리자"},{"no":"331","name":"최호영(025067) 사원"},{"no":"1163","name":"최홍기(144112) 대리"},{"no":"144","name":"최희영(062381) 과장"},{"no":"768","name":"최희영(502148) HyosungITX SV"},{"no":"243","name":"최희준(095594) 주임"},{"no":"230","name":"탁현숙(066588) 과장"},{"no":"54","name":"표상순(122484) 대리"},{"no":"145","name":"하걸범(093087) 주임"},{"no":"1245","name":"하민정(114581) 사원"},{"no":"134","name":"하영실(095002) 대리"},{"no":"258","name":"한건수(991742) 과장"},{"no":"52","name":"한동훈(116948) 부장"},{"no":"146","name":"한명식(066273) 과장"},{"no":"351","name":"한미애(112499) 사원"},{"no":"1225","name":"한미영(p9000h) 관리자"},{"no":"759","name":"한정순(502173) HyosungITX MG"},{"no":"248","name":"한혜원(095597) 주임"},{"no":"1082","name":"함선희(p900jm) 사원"},{"no":"43","name":"허준(125379) 팀장"},{"no":"203","name":"허진영(114586) 주임"},{"no":"1241","name":"홍보람(990C25) 팀장"},{"no":"177","name":"홍상연(068639) 대리"},{"no":"1174","name":"홍성범(144859) 주임"},{"no":"1097","name":"홍순길(p901tn) 사원"},{"no":"338","name":"홍아름(112491) 사원"},{"no":"116","name":"홍준표(110628) 과장"},{"no":"65","name":"홍지선(123697) 주임"},{"no":"362","name":"황보소영(112493) 사원"},{"no":"560","name":"황성철(133363) 대리"},{"no":"189","name":"황인혁(102684) 주임"}];
var systemList = ["ssg-batch-app","ssg-bo-webapp","ssg-ecms-webapp","ssg-pco-webapp","ssg-pdo-webapp","ssg-po-webapp","ssg-cso-webapp","ssg-eapi-webapp","ssg-mapi-webapp","ssg-uapi-webapp","ssg-capi-webapp","ssg-event-webapp","ssg-emart-webapp","ssg-boons-webapp","ssg-traders-webapp","ssg-memall-webapp","ssg-mtraders-webapp","ssg-msmall-webapp","ssg-mlguplus-webapp","ssg-mssgmall-webapp","ssg-member-webapp","ssg-pay-webapp","ssg-mmember-webapp","ssg-mpay-webapp","ssg-department-webapp","ssg-small-webapp","ssg-ssgmall-webapp","ssg-ssgli-webapp","ssg-redirect-webapp","pg-api-webapp","pg-batch","pg-bo-webapp","pg-www-webapp","ssg-bo-library","ssg-common-library","ssg-emall-library","ssg-framework-support","ssg-instant.win-library","ssg-member-library","ssg-mileage-library","ssg-pay-library","ssg-pd-library","ssg-search-library","ssg-shorturl-library","ssg-small-library","ssg-ssgmall-library","ssg-uapi.client-library","ssg-media-webapp-image","ssg-media-webapp-purge"];
var distributionSystemList = ["데이터","프론트PC ALL","프론트Mobile ALL","백엔드 ALL","SSG","mSSG","신세계몰","신세계백화점","m신세계몰","mlguplus","이마트몰","트레이더스","분스","m이마트몰","m트레이더스","SSG - android APP","신세계몰 - android APP","이마트몰 - android APP","SSG - ios phone APP","신세계몰 - ios phone APP","이마트몰 - ios phone APP","SSG - ios pad APP","신세계몰 - ios pad APP","이마트몰 - ios pad APP","가상스토어 - android APP","가상스토어 - ios phone APP","가상스토어 - ios pad APP","SFC - android APP","SFC - ios phone APP","SFC - ios pad APP","이벤트","member","mmember","pay","mpay","LI","BO","PO","PDO","PCO","CSO","ECMS","eAPI","cAPI","mAPI","uAPI","batch","media","purge","PG_프론트","PG_BO","PG_API"];
=======
(function() {
    'use strict';

    angular
        .module('buildnote', ['checklist-model']);

})();
>>>>>>> origin/gh-pages
