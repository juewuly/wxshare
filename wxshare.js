/**
 * @require jquery
 * name: wxshare.js
 * author: Tengfei
 * date: 2016/05/20
 */
(function(win, doc, undefined) {

  var root = win;
  var WXShare = {

    config: {
      share: {
        title: document.title,
        desc: '',
        link: location.href,
        imgUrl: 'http://img01.liwushuo.com/image/160520/r8f1g67b7_w.png', // 如果没有配置当然是我司logo啦
        success: function () { 
          // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
          // 用户取消分享后执行的回调函数
        }
      },
      customShare: true
    },

    init: function(config) {
      var that = this;
      $.extend(true, that.config, config);

      var _conf = that.config;

      //分享
      _conf.customShare && that.initShare();
    },

    initShare: function() {
      var that = this;
      
      $.ajax({
        type: "post",
        dataType: "json",
        cache: false,
        url: '/api/wechat/config',
        data: {
          url: location.href.split('#')[0]
        },
        success: function(res) {
          if (res.code === 200) {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: 'wxe698f11ffa868d84', // 必填，公众号的唯一标识
              timestamp: res.data.sign.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.data.sign.nonceStr, // 必填，生成签名的随机串
              signature: res.data.sign.signature, // 必填，签名，见附录1
              jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'hideMenuItems',
                'openAddress'
                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              ]
            });
            that.setShare(that.config.share);
          }
        },
        error: function(jqXHR, exception) {
          that.xhrErrorHandler(jqXHR, exception);
        }
      });
    },

    setShare: function(shareConf) {
      var that = this;
      if (that.browser == 'wechat') {
        wx.ready(function() {
          wx.onMenuShareTimeline(shareConf);
          wx.onMenuShareAppMessage(shareConf);
      
          wx.hideMenuItems({
            menuList: [
              'menuItem:share:qq',
              'menuItem:share:weiboApp',
              'menuItem:share:facebook',
              'menuItem:share:QZone',
              // 'menuItem:copyUrl',
              'menuItem:openWithSafari',
              'menuItem:share:email',
              'menuItem:share:brand',
              'menuItem:openWithQQBrowser',
              'menuItem:originPage',
              'menuItem:delete',
              'menuItem:editTag',
              'menuItem:readMode'
            ],
            success: function (res) {},
            fail: function (res) {}
          });

          // wx.showMenuItems({
          //     menuList: [
          //       'menuItem:share:appMessage',
          //       'menuItem:share:timeline',
          //       'menuItem:favorite'
          //     ]
          // });
        });
      }
    },

    xhrErrorHandler: function(jqXHR, exception) {
      //这里无需显示alert error干扰用户
    },

    browser: function() {
      var ua = navigator.userAgent.toLowerCase();
      if (/micromessenger/.test(ua)) {
        return 'wechat';
      } else if (/(iphone|ipod|ipad)/i.test(ua)) {
        return 'ios';
      } else if (/(android)/i.test(ua)) {
        return 'android';
      } else if (/(windows phone)/i.test(ua)) {
        return 'wp';
      } else {
        return 'pc';
      }
    }(),

    isInApp: function() {
      var ua = navigator.userAgent.toLowerCase();
      return /(gifttalk|liwushuo)/i.test(ua);
    }()

  };

  root.WXShare = WXShare;

  if (typeof module === "object" && module && typeof module.exports === "object") {
    module.exports = WXShare;
  } else {
    if (typeof define === 'function' && define.amd) {
      define('wxshare', [], function() {
        return WXShare;
      });
    }
  }

})(window, document);
