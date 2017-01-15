var timerUtils = require('time.js');
function Ticker(tickReady) {
    this.tickReady = tickReady;
    this.init();
}

Ticker.prototype = {

    init: function() {

        var _this = this;
        var todayKey = 'ticks-' + timerUtils.formateDate();
        
        wx.getStorage({
          key: todayKey,
          success: function(res) {
            _this.ticks = res.data;
            _this.tick();

            _this.tickReady && _this.tickReady(_this.ticks);
          },
          fail: function() {
            _this.ticks = {
                list: [],
                current : {

                }
            }
          },
          complete: function() {
            // complete
          }
        })

    },
    /**
     * 启动
     */
    start: function(desc, color, category, time) {
        if (this.ticks.current.start) {
            this.ticks.current.end = new Date().getTime();
            this.ticks.list.push(this.ticks.current);
        }
        this.ticks.current = {
            desc: desc,
            color: color || '#fe0',
            category: category || '',
            start: time || new Date().getTime()
        };

        this.save();
        this.tick();
    },

    save: function(callback) {
        wx.setStorage({
            key: 'ticks-' + timerUtils.formateDate(),
            data: this.ticks,
            success: function(res){
                callback && callback();
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
        });
    },

    stop: function(callback) {
      if (this.ticks.current.start && !this.ticks.current.end){
          this.ticks.current.end = new Date().getTime();
          this.ticks.list.push(this.ticks.current);
          this.ticks.current = {};
          this.save(callback);
      }
    },

    tick : function() {
        if (this.ticks.current.start && !this.ticks.current.end) {
            this.onTick && this.onTick(timerUtils.formatDura(new Date().getTime() - this.ticks.current.start), this.ticks.current.desc);
            setTimeout(this.tick.bind(this), 1000);
        }
    }

};


module.exports.Ticker = Ticker;