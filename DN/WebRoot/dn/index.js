// JavaScript Document

var p = {
    style: function (ele) {
        var _box = $(ele)
        _box.css({
            left: ($(window).width() - _box.width()) / 2,
            top: $(document).scrollTop() + ($(window).height() - _box.height()) / 2
        });
        if (_box.height() > ($(window).height() - 20)) {
            _box.css({
                top: $(document).scrollTop()
            });
        }

        $('.alert_bg').css({
            width: $(window).width(),
            height: $(document).height(),
            opacity: 0.5
        });
    },
    show: function (ele) {
        $(window).resize(function () {
            p.style(ele);
        });
        p.style(ele);
        $('.alert_bg').fadeIn(300);
        $(ele).fadeIn(300);
        return;
    }
};

var itemList = ["钻石潘多拉火种<br/>（1天）*1+钻石潘多<br/>拉之心（1天）*1", "阿依夏之幽梦宝匣<br/>（1天）*1+阿依夏之宝<br/>匣钥匙（1天）*1", "透视放大镜*2", "复活书*5", "物品保护魔法药*10<br/>（7天）", "封印印章*10 （7天）",
    "神奇的动物饰品箱", "金币福袋（初级）", "烈火九尾狐（7天）*1", "兔湿G头带（7天）*1", "兔湿G尾巴（7天）*1", "主手武器强化+1券", "副手武器强化+1券",
    "防具强化+1券（头部）", "防具强化+1券（上衣）", "防具强化+1券（裤子）", "防具强化+1券（手套）", "防具强化+1券（鞋子）", "女神的称号交换券 <br/>- 分担女神悲伤的<br/>（30天）", "女神的称号交换券 <br/>- 带有悲伤情感的<br/>（30天）", "女神的称号交换券<br/>- 含泪的（30天）", "黑暗方块*1", "光明方块*1", "冰龙逆鳞（L级）*1", "空"];
var isplay = false;
var bl = false;
$(function () {
    bindmyList();
    //抽奖弹窗

    //弹层
    $('.btn_listGift').click(function () {
        p.show('.dialog_listGift')
    })


    $('.btn_rule').click(function () {
        p.show('.dialog_rule')
    })


    $('.close_dialog, .btn_sure').click(function () {
        isplay = false;
        $(this).parent().fadeOut(300);
        $('.alert_bg').fadeOut(300);
    });

    //翻牌前hover
    $('.box_gift .one_a').hover(
		function () {
		    $(this).parent().addClass('hover')
		},
		function () {
		    $(this).parent().removeClass('hover')
		}
	);

    //翻牌ing
    $('.box_gift').on('click', '.one_a', function () {
        var tasknum = $("#hid_tasknum").val();
        var num = $(this).attr("data-i");
        if (isplay) return false;
        $.ajax({
            type: "POST",
            url: "Handler/Check.ashx",
            async: false,
            cache: false,
            dataType: 'json',
            success: function (data) {
                isplay = false;
                if (data.IsSuccess) {
                    bl = true;
                } else {
                    isplay = true;
                    if (data.ReturnCode == -998) {
                        $("#txt_msg").html(data.Message);
                        p.show('.dialog_addenda');
                        bl = false;
                        return;
                    }else if (data.ReturnCode == -999) {
                        if (confirm("请先登录")) {
                            $("#sdoLoginIframe")[0].src = "Login.aspx?" + Math.random();
                            showLoginPop.show();
                            bl = false;
                            return;
                        } else {
                            isplay = false;
                            bl = false;
                            return;
                        }
                    } else {
                        if (tasknum == "-1")
                            $("#txt_msg").html("勇士，今天的数据还未同步，请于10:00后登陆页面领取奖励！");
                        else if (tasknum == "0")
                            $("#txt_msg").html("勇士，您没有完成昨日的试练任务（或数据暂未同步成功），暂时无法领取奖励！<br/>别气馁，完成今日的试练任务，明天还可以领取“艾琳的礼物”。");
                        else
                            $("#txt_msg").html("勇士，您今天的奖励已经领取过了！<br/>赶紧完成今日的试练任务，明天再来领取“艾琳的礼物”吧！");
                        p.show('.dialog_addenda');
                        bl = false;
                        return;
                    }
                }
            }
        });
        if (bl) {
            isplay = true;
            var dataval = 25;
            $.ajax({
                type: "post",
                url: "Handler/lottery.ashx",
                async: false,
                cache: false,
                dataType: 'json',
                success: function (data) {
                    if (data.IsSuccess) {
                        var codeid = parseInt(data.ReturnCode);
                        $("#img_" + num).attr("src", "http://static.sdg-china.com/dn/pic/dn_act/160101Gift/pic_gift" + codeid + ".png");
                        $("#img_" + num).siblings(".des_bg").find("p").html(itemList[(codeid - 1)]);
                        var itemname = itemList[(codeid - 1)];
                        itemname = itemname.replace("<br/>", "");
                        if (codeid >= 1 && codeid < 12)
                            $("#txt_msg").html("恭喜您获得" + itemname + "，奖励已发送至礼物盒，请14天内登录游戏进行领取！");
                        else if (codeid >= 12 && codeid < 19)
                            $("#txt_msg").html("恭喜您获得" + itemname + "，强化操作将于活动结束后3个工作日内进行。请您确保<br/>这段期间您所希望强化的武器/防具在您的角色装备栏中。本次强化只针对90级及以上A/S/L级<br/>装备，不包括暴风武器等活动装备！");
                        else if (codeid >= 19 && codeid < 25)
                            $("#txt_msg").html("恭喜您获得" + itemname + "，奖励已发送至邮箱，请30天内登录游戏进行领取！");
                        else
                            $("#txt_msg").html("就差一点点，别灰心！完成今日任务，明天运气会更好哦！");
                        var n = num;
                        var m = codeid;
                        var o = 0;
                        var idlist = data.ReturnObject;
                        var list = idlist.split(",");
                        for (var i = 0; i < list.length; i++) {
                            if (i == (n - 1)) {
                                o = list[i];
                            }
                        }
                        for (var i = 0; i < list.length; i++) {
                            if (list[i] == m) {
                                list[i] = o;
                            }
                        }
                        for (var j = 0; j < list.length; j++) {
                            if (j + 1 != n) {
                                $("#img_" + (j + 1)).attr("src", "http://static.sdg-china.com/dn/pic/dn_act/160101Gift/pic_gift" + list[j] + ".png");
                                $("#img_" + (j + 1)).siblings(".des_bg").find("p").html(itemList[(list[j] - 1)]);
                            }
                        }
                        p.show('.dialog_addenda');
                    } else {
                        isplay = false;
                        if (data.ReturnCode == -999) {
                            if (confirm("请先登录")) {
                                $("#sdoLoginIframe")[0].src = "Login.aspx?" + Math.random();
                                showLoginPop.show();
                                return;
                            } else {
                                return;
                            }
                        } else {
                            alert(data.Message);
                            return;
                        }
                    }
                }
            });
            $(this).parents('.ele').find('.js_gift').stop().animate({ 'width': 0, 'left': '50%' }, 200, function () {
                $(this).parents('.ele').addClass('on');
                $(this).animate({ 'width': '100%', 'left': 0 }, 200, function () {
                    $(this).find('.pic_gift_checked').fadeIn(0);
                    //翻开所有
                    var i = $('.box_gift .ele').index($(this).parent());
                    $('.box_gift .ele').each(function (index) {
                        if (index != i) {
                            $(this).find('.js_gift').stop().animate({ 'width': 0, 'left': '50%' }, 200, function () {
                                $(this).parent().addClass('on');
                                $(this).animate({ 'width': '100%', 'left': 0 }, 200);
                            });
                        }
                    })

                    //翻牌后hover
                    $('.box_gift .two_a, .box_gift .des_bg').on('mouseenter', function () {
                        $(this).parent().find('.des_bg').fadeIn(300);
                    })
                    $('.box_gift .des_bg').on('mouseleave', function () {
                        $(this).fadeOut(300);
                    })
                });
            });
            bindmyList();
        }
    })


});

function bindmyList() {
    $("#mylist").empty();
    var str = "";
    $.post("handler/GetMyLogList.ashx", {}, function (data) {
        if (data.IsSuccess) {
            if (data.ReturnObject != null) {
                var obj = eval("(" + data.ReturnObject + ")");
                if (obj.length == 0) {
                    str = str + '<li>暂无数据！</li>';
                }
                for (var i = 0; i < obj.length; i++) {
                    str = str + '<li>' + obj[i].Time + '  获得了：' + obj[i].Msg + '</li>';
                }
            }
        }
        $("#mylist").html(str);
    }, "json");
}