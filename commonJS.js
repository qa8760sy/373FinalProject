$(document).ready(function(){
    const $lis = $(".rightNavBar ul li");
    $lis.each(function (index) {
        $(this).data('idx', index);
    });

    $('#sortbutton').on('click', function() {
        const $spans = $lis.find("span");
        const visible = $spans.is(":visible");
        $spans.toggle();
        if(visible) {
            sort(".rightNavBar ul");
        } else {
            restore(".rightNavBar ul");
        }
    });
});

function restore(selector) {
    $(selector).children("li").sort(function(a, b) {
        const A = $(a).data('idx');
        const B = $(b).data('idx');
        return (A < B) ? -1 : (A > B) ? 1 : 0;
    }).appendTo(selector);
}

function sort(selector) {    
    $(selector).children("li").sort(function(a, b) {
        const A = $(a).find('a').text().toUpperCase();
        const B = $(b).find('a').text().toUpperCase();
        return (A < B) ? -1 : (A > B) ? 1 : 0;
    }).appendTo(selector);
}
function tableSort(selector){
    $(selector).children("td").sort(function(a,b){
        
    }).appentTo(selector);
}
  
                 