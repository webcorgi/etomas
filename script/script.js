// 페이지 전환 애니메이션 공통 함수
function initPageTransition() {
    // 이미 페이지 구조가 있는 경우에만 처리
    if ($('.page-container').length && $('.btn-choise-item').length) {
        // 초기 상태 설정: nextPage가 오른쪽에 위치하도록
        $('#nextPage').addClass('next');
        
        // 버튼 클릭 이벤트 등록 (중복 등록 방지)
        $('.btn-choise-item').off('click.pageTransition').on('click.pageTransition', function() {
            var target = $(this).data('target');
            
            if (!target) return;
            
            // 클릭한 버튼 강조 효과
            $(this).addClass('clicked');
            $('.choise__items').addClass('has-clicked');
            
            // 모든 버튼 비활성화
            $('.btn-choise-item').prop('disabled', true);
            $(this).closest('.choise__wrap').addClass('loading-transition');
            
            // AJAX로 다음 페이지 콘텐츠 가져오기 (애니메이션 전에 먼저 로드)
            $.get(target)
                .done(function(data) {
                    // 다음 페이지의 실제 콘텐츠만 추출 (page-container 내부의 내용)
                    var $data = $(data);
                    var eventTab = $data.find('.event__tab').prop('outerHTML') || '';
                    var choiseWrap = $data.find('.choise__wrap').prop('outerHTML') || '';
                    var resultWrap = $data.find('.result__wrap').prop('outerHTML') || '';
                    
                    var nextContent = eventTab + choiseWrap + resultWrap;
                    $('#nextPage').html(nextContent);
                    
                    // 콘텐츠 로드 후 즉시 애니메이션 시작
                    setTimeout(function() {
                        $('#nextPage').addClass('slide-in');
                        $('#currentPage').addClass('slide-out');
                    }, 50);
                })
                .fail(function() {
                    // 실패 시 로딩 메시지
                    $('#nextPage').html(`
                        <div class="choise__wrap">
                            <div class="choise__contents">
                                <h1>페이지를 불러오는 중...</h1>
                            </div>
                        </div>
                    `);
                    
                    setTimeout(function() {
                        $('#nextPage').addClass('slide-in');
                        $('#currentPage').addClass('slide-out');
                    }, 50);
                });
            
            // 애니메이션 완료 후 실제 페이지로 이동
            setTimeout(function() {
                window.location.href = target;
            }, 900);
        });
    }
}

// 페이지 로드 시 자동 초기화
$(document).ready(function() {
    // 현재 페이지가 loading 페이지인지 확인
    if (window.location.pathname.includes('loading.html')) {
       // none
    } else {
        // 일반 페이지 전환 초기화
        initPageTransition();
    }
});
