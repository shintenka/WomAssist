 * 点击滑动制定位置  
 * @param scrolldom     点击的制定元素  
 * @param scrollTime    滑动的时间  
 */  
$.scrollto = function (scrolldom,scrollTime) {  
    //dom点击事件  
    $(scrolldom).click(function () {  
        //查找点击dom里的属性，要在dom元素里添加  
        var scrolldom = $(this).attr('data-scroll');  
        //点击后添加的样式  
        $(this).addClass('colorF').siblings().removeClass('colorF69')  
        //html。body执行动画  
        //animate() 方法执行 CSS 属性集的自定义动画。  
        $('html,body').animate({  
            scrollTop:$(scrolldom).offset().top  
        },scrollTime);  
  
        //返回false，直接在现在位置继续执行动画  
        return false;  
    });  
}  
//函数调用，  $(“html,body”).animate({scrollTop:$(“#box”).offset().top},1000)
$(“html,body”).animate({scrollTop:$(“#chapter3”).offset().top},1000);