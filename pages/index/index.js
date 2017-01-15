//index.js
//获取应用实例

var app = getApp()

var Ticker = require('../../utils/tick.js').Ticker;

Page({
    data: {
        newStates: 'off',
        newFocus: false,
        currentTask: '',
        ticking: 0,
        lineData: [], //已经消耗的时间线信息
        tickHours: {}, //已经消耗的时间线信息
        userInfo: {}
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    btnEventStart: function () {
        this.ticker.start(this.data.currentTask);

        this.setData({
            newStates: 'hid',
            currentTask: '',
            newFocus: false
        });
    },

    btnEventStop: function () {

        this.setData({
            stoppingOut: this.animations.zoomOut.export(),
            stoppingFade: this.animations.fadeOut.export()
        });
        
        this.ticker.stop(function() {
            
        });

        setTimeout(function() {
            this.setData({
                currentTask: '',
                stoppingOut: '',
                formatedTicking: false,
                stoppingFade: ''
            });
        }, 600);
    },

    bindKeyInput: function (e) {
        this.setData({
            currentTask: e.detail.value
        });
    },
    btnEventNew: function () {
        this.setData({
            newStates: 'on',
            newFocus: true
        })
    },

    eventCancelStart: function (event) {
        console.log(event);

        if (event.target.id === "newContainer") {
            this.setData({
                newStates: 'off',
                newFocus: false
            });
        }
    },


    /**
     * 读取完计时信息后进行数据预处理，然后更新到data上
     * @method tickReady
     * @param ticks
     */
    tickReady: function (ticks) {
        var lineData = [];

        var tickByHours = {};

        var d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        var t = d.getTime();
        var daymill = 24 * 60 * 60 * 1000;

        //这里计算出时间线内容
        for (var i = 0; i < ticks.list.length; i++) {
            var ld = {};
            ld.top = 2400 * (ticks.list[i].start - t) / daymill;
            ld.height = 2400 * (ticks.list[i].end - ticks.list[i].start) / daymill;
            ld.color = ticks.list[i].color;
            lineData.push(ld);

            var tickHour = new Date(ticks.list[i].start).getHours();

            if (tickByHours[tickHour] == null) {
                tickByHours[tickHour] = [{
                    desc: ticks.list[i].desc
                }];
            } else {
                tickByHours[tickHour].push({
                    desc: ticks.list[i].desc
                });
            }
        }

        console.log(tickHour);

        this.setData({
            lineData: lineData,
            tickHours: tickByHours
        });
    },

    onLoad: function () {
        console.log('onLoad');

        var that = this;

        this.ticker = new Ticker(that.tickReady);

        this.animations = {
            zoomOut: wx.createAnimation({
                transformOrigin: "50% 50%",
                duration: 500,
                timingFunction: "ease",
                delay: 0
            }).scale(4).opacity(0).step(),
            fadeOut: wx.createAnimation({
              duration: 500,
              timingFunction: 'ease',
              delay: 0,
              transformOrigin: '50% 50% 0'
            }).opacity(0).step()
        };

        this.ticker.onTick = function (formatedTicking, task) {
            that.setData({
                currentTask: task,
                formatedTicking: formatedTicking,
                minize: false
            });
        };


        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    }
})
