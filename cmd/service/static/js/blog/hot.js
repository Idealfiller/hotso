$(document).ready(function () {
    getHotInfo()
});
function getHotInfo() {
    $.ajax({
        url:ServerIp+"/type",
        type:"GET",
        async:true,
        data:{},
        timeout:5000,
        dataType:'json',
        success:function (data) {
           setBar(data)
        },
        error:function () {
            console.log("失败");
        }
    })
}

function setBar(object) {
    var code = '';
    var bodyCode = '';
    var isAllShow = localStorage.getItem("isAllShow")
    for (var i in object) {
        if (i > 13 && (isAllShow == "no" || isAllShow == undefined)) {
            code += '<li role="presentation"><a style="display: none" hreflang="'+object.length+'" rel="'+i+'" type="'+object[i].id+'" onclick="getOwnInfo(this)" href="#'+object[i].id+'" aria-controls="profile" role="tab" data-toggle="tab">'+object[i].name+'</a></li>';
        } else {
            $("#iconAllShow").attr("class","glyphicon glyphicon-minus")
            if (i == 0) {
                code += '<li class="active"  role="presentation"><a hreflang="'+object.length+'" rel="'+i+'" type="'+object[i].id+'" onclick="getOwnInfo(this)" href="#'+object[i].id+'" aria-controls="profile" role="tab" data-toggle="tab">'+object[i].name+'</a></li>';
            } else {
                code += '<li  role="presentation"><a hreflang="'+object.length+'" rel="'+i+'" type="'+object[i].id+'" onclick="getOwnInfo(this)" href="#'+object[i].id+'" aria-controls="profile" role="tab" data-toggle="tab">'+object[i].name+'</a></li>';
            }
        }
        if (i == 0) {
            // tab-pane active
            var infoCode = getListInfo(object[i].id)
            bodyCode += '<div role="tabpanel" class="tab-pane active" id="'+object[i].id+'"><div class="b-list"><div class="ant-list ant-list-split ant-list-bordered"><div class="ant-spin-nested-loading"><div class="ant-spin-container" id="myOnlyInfo'+object[i].id+'">'+infoCode+'</div></div></div></div></div>';
        } else {
            bodyCode += '<div role="tabpanel" class="tab-pane" id="'+object[i].id+'"><div class="b-list"><div class="ant-list ant-list-split ant-list-bordered"><div class="ant-spin-nested-loading"><div class="ant-spin-container" id="myOnlyInfo'+object[i].id+'"></div></div></div></div></div>';
        }

    }
    var noApplicationRecord = document.getElementById('myHotBar')
    noApplicationRecord.innerHTML = code
    var bodyHtmlCode = document.getElementById('tab-content')
    bodyHtmlCode.innerHTML = bodyCode
    var lastReadId = localStorage.getItem("lastReadId")
    if (lastReadId != null){
        $("a[rel='"+lastReadId+"']").click()
    }
    // layer.msg('点击右下方"+/-",可切换全部展示和循环展示(如果无效需要清除浏览器JavaScript代码缓存)',{time:3000});
}

function getOwnInfo(item) {
    localStorage.setItem("lastReadId",item.rel)
    var current = Number(item.rel);
    var code = getListInfo(item.type)
    var id = "myOnlyInfo" + item.type
    var bodyHtmlCode = document.getElementById(id)
    bodyHtmlCode.innerHTML = code
    var isAllShow = localStorage.getItem("isAllShow")
    if (isAllShow == "no" || isAllShow == undefined) {
        var beShow = new Array();
        var temp = 7;
        var count = 0;
        var left = 0;
        var right = 0;
        beShow.push(current)
        while (temp > 0) {
            count++
            if (beShow.length < 14) {
                right = current+count
                left = current-count;
                if (left < 0) {
                    left = 7+current+(-left)
                }
                if (right > item.hreflang) {
                    right = current-count-7
                }
                if (beShow.length < 14) {
                    beShow.push(right)
                }
                if (beShow.length < 14) {
                    beShow.push(left)
                }
            }
            temp--
        }
        //console.log(beShow)
        for (var v= item.hreflang;v>=0;v--) {
            if (beShow.indexOf(v) >= 0) {
                $("a[rel='"+v+"']").show()
            } else {
                $("a[rel='"+v+"']").hide()
            }
        }
    }

}

function getListInfo(id) {
    var url = ServerIp+'/typeinfo';
    var myCode = ''
    $.ajax({
        url:url,
        type:"GET",
        async:false,
        data:{id:id},
        timeout:5000,
        dataType:'json',
        success:function (data) {
            myCode = setEachInfo(data['data'])
        },
        error:function () {
            console.log("失败");
        }
    })
    return myCode
}

function setEachInfo(object) {
    var allInfo = ''
    var count = 1
    var desc = ""
    for (var i in object) {
        var haveSee = localStorage.getItem(object[i].title)
        if (haveSee != null) {
            allInfo += '<div class="ant-list-item">\n' +
                '    <div class="ant-list-item-meta">\n' +
                '        <div class="ant-list-item-meta-content">\n' +
                '            <h4 class="ant-list-item-meta-title">\n' +
                '                <div><span>'+count+'.&nbsp;</span><a onclick="haveSee(this)" href="'+object[i].url+'" target="_blank"><span style="color: grey">'+object[i].title+'</span></a>\n' +
                '                </div>\n' +
                '            </h4><div class="ant-list-item-meta-description">\n' +
                '        '+desc+'\n' +
                '      </div>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '</div>';
        } else {
            allInfo += '<div class="ant-list-item">\n' +
                '    <div class="ant-list-item-meta">\n' +
                '        <div class="ant-list-item-meta-content">\n' +
                '            <h4 class="ant-list-item-meta-title">\n' +
                '                <div><span>'+count+'.&nbsp;</span><a onclick="haveSee(this)" href="'+object[i].url+'" target="_blank"><span style="">'+object[i].title+'</span></a>\n' +
                '                </div>\n' +
                '            </h4><div class="ant-list-item-meta-description">\n' +
                '        '+desc+'\n' +
                '      </div>\n\n' +
                '        </div>\n' +
                '    </div>\n' +
                '</div>';
        }

        count += 1
    }
    return allInfo
}

function feedback() {
    layer.tips('吐槽和建议，欢迎反馈~', '#feedBackMine', {
        tips: [1, '#0FA6D8'], //还可配置颜色
        time:1000
    });
}
function feedbackComment() {
    layer.tips('吐槽和建议，欢迎反馈~', '#feedBackMine', {
        tips: [1, '#0FA6D8'], //还可配置颜色
        time:1000
    });
}

function haveSee(name) {
    localStorage.setItem(name.text,name.text)
    $(name).find("span").css("color","grey")
}

function AllShow() {
    layer.tips('全部展示/循环展示', '#allShow', {
        tips: [1, '#0FA6D8'], //还可配置颜色
        time:1000
    });
}

function AllShowDo() {
    var isAllShow = localStorage.getItem("isAllShow")
    console.log(isAllShow)
    if (isAllShow == "yes") {
        // 全部展示
        localStorage.setItem("isAllShow","no")
        $("#iconAllShow").attr("class","glyphicon glyphicon-plus")
        var lastReadId = localStorage.getItem("lastReadId")
        if (lastReadId != null){
            $("a[rel='"+lastReadId+"']").click()
        }

    } else {
        localStorage.setItem("isAllShow","yes")
        // glyphicon glyphicon-minus
        $("#iconAllShow").attr("class","glyphicon glyphicon-minus")
        for (var v= 30;v>=0;v--) {
            $("a[rel='"+v+"']").show()
        }

    }
}