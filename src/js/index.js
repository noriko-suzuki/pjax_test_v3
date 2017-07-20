$(function(){
    $.pjax({
        area : '.l-body',
        link : 'a:not([target])',
        ajax: { timeout: 2000},
        wait: 600
    });

    $(document).bind('pjax:fetch', function(){
        $('body').css('overflow', 'hidden');
        $('.l-body').attr({'class': 'fadeOut l-body'});
    });
    $(document).bind('pjax:render', function(){
        $('.l-body').attr({'class': 'fadeIn l-body'});
        $('body').css('overflow', '');
    });

});
