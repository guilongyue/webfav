/**
 * 可以选择早中晚时间的插件
 * 用法如下
 * Ext.onReady(function(){
		var date = new Date();
		var dateField = new Ext.form.DateField({
			renderTo:Ext.getBody(),
			menu : new DatetimeMenuPlugin(),
			format:'y-m-d H:i:s',
			value:date
		});
	})
 */
Ext.namespace('jty.date');
jty.date.DatetimePicker = function (config) {
	/** Call superclass constructor * */
	jty.date.DatetimePicker.superclass.constructor.call(this, config);
};
getRadioValue = function(radioName){//得到radio的值
	var obj=document.getElementsByName(radioName);
	for(var i=0;i<obj.length;i++){
	if(obj[i].checked){
		return obj[i].value;
		}
	}
}
var countFlag = 2;//时间菜单弹出和隐藏的次数
/**
 * 根据选中的早中晚设置时间的时分秒
 * @param {} date
 */
setDateTime = function(date){
	var radioValue = getRadioValue('time_radio');
	var hours = 0,minutes = 0,secods = 0;
	if('morning' == radioValue){
		hours = 0;
		minutes = 0;
		secods = 0;
	}else if('midday' == radioValue){
		hours = 11;
		minutes = 59;
		secods = 59;
	}else if('evening' == radioValue){
		hours = 23;
		minutes = 59;
		secods = 59;
	}
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(secods);
}
Ext.extend(jty.date.DatetimePicker, Ext.DatePicker, {

	/**
	 * Method Name: onRender Description: as per Ext.DatePicker's onRender,
	 * except renders year in its own cell with arrow-changers in additional
	 * columns Parameters: as per Ext.DatePicker's onRender Returns: n/a Throws:
	 * n/a
	 */
	selectToday: function () {
		this.setValue(new Date().clearTime());
		var val1 = this.value;
		setDateTime(val1);
		this.fireEvent("select", this, val1);
	},
	handleDateClick: function (e, t) {
		e.stopEvent();
		if (t.dateValue && !Ext.fly(t.parentNode).hasClass("x-date-disabled")) {
			this.setValue(new Date(t.dateValue));
			var val1 = this.value;
			setDateTime(val1);
			this.fireEvent("select", this, val1);
		}
	},
	setValue : function(value) {
		var old = this.value;
		this.value = new Date(value.getTime());
		if (this.el) {
			this.update(this.value);
		}
	},
	onRender: function (container, position) {
		var m = ['<table cellspacing="0">', '<tr><td colspan="3"><table cellspacing="0" width="100%"><tr><td class="x-date-left"><a href="#" title="', this.prevText, '">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="', this.nextText, '">&#160;</a></td></tr></table></td></tr>', '<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>'];
		var dn = this.dayNames;
		for (var i = 0; i < 7; i++) {
			var d = this.startDay + i;
			if (d > 6) {
				d = d - 7;
			}
			m.push("<th><span>", dn[d].substr(0, 1), "</span></th>");
		}
		m[m.length] = "</tr></thead><tbody><tr>";
		for (i = 0; i < 42; i++) {
			if (i % 7 === 0 && i !== 0) {
				m[m.length] = "</tr><tr>";
			}
			m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
		}

		//隐藏早上或者晚上的radio控件
		var startOrFinish = this.startOrFinish;
		var uuid = this.uuid;
		var morningDisplay = '';
		var eveningDisplay = '';
		var morningId,middayId,eveningId;
		if(startOrFinish){
			if(startOrFinish == 'start'){
				morningId = 'start_morning_time_radio'+uuid;
				middayId = 'start_midday_time_radio'+uuid;
				eveningDisplay = 'display: none;';
			}else if(startOrFinish == 'finish'){
				middayId = 'finish_midday_time_radio'+uuid;
				eveningId = 'finish_evening_time_radio'+uuid;
				morningDisplay = 'display: none;';
			}
		}
		
		m[m.length] = '</tr></tbody></table></td></tr><tr><td class="minutecss"><table cellspacing="0" ><tr>';
		m[m.length] = '<td class="" style="'+morningDisplay+'"><a href="#" title="早"><input id="'+morningId+'" type="radio" name="time_radio" value="morning">早</input> </a></td><td class="" align="center"></td><td class=""><a href="#" title="up">&nbsp;</a></td>';
		m[m.length] = '<td class=""><a href="#" title="中">&nbsp;<input id="'+middayId+'" type="radio" name="time_radio" value="midday">中</input>&nbsp;&nbsp;</a></td><td class="" align="center"></td><td class="" style="'+eveningDisplay+'"><a href="#" title="晚"><input id="'+eveningId+'" type="radio" name="time_radio" value="evening">晚</input> </a></td>';
		m[m.length] = '</tr></table></td><td  colspan="2" class="x-date-bottom" align="center"></td></tr></table><div class="x-date-mp"></div>';

		var el = document.createElement("div");
		el.className = "x-date-picker";
		el.innerHTML = m.join("");

		container.dom.insertBefore(el, position);

		this.el = Ext.get(el);
		this.eventEl = Ext.get(el.firstChild);

		new Ext.util.ClickRepeater(this.el.child("td.x-date-left a"), {
			handler: this.showPrevMonth,
			scope: this,
			preventDefault: true,
			stopDefault: true
		});

		new Ext.util.ClickRepeater(this.el.child("td.x-date-right a"), {
			handler: this.showNextMonth,
			scope: this,
			preventDefault: true,
			stopDefault: true
		});

		this.eventEl.on("mousewheel", this.handleMouseWheel, this);

		this.monthPicker = this.el.down('div.x-date-mp');
		this.monthPicker.enableDisplayMode('block');

		var kn = new Ext.KeyNav(this.eventEl, {
			"left": function (e) {
				e.ctrlKey ? this.showPrevMonth() : this.update(this.activeDate.add("d", -1));
			},

			"right": function (e) {
				e.ctrlKey ? this.showNextMonth() : this.update(this.activeDate.add("d", 1));
			},

			"up": function (e) {
				e.ctrlKey ? this.showNextYear() : this.update(this.activeDate.add("d", -7));
			},

			"down": function (e) {
				e.ctrlKey ? this.showPrevYear() : this.update(this.activeDate.add("d", 7));
			},

			"pageUp": function (e) {
				this.showNextMonth();
			},

			"pageDown": function (e) {
				this.showPrevMonth();
			},

			"enter": function (e) {
				e.stopPropagation();
				return true;
			},

			scope: this
		});

		this.eventEl.on("click", this.handleDateClick, this, {
			delegate: "a.x-date-date"
		});

		this.eventEl.addKeyListener(Ext.EventObject.SPACE, this.selectToday, this);

		this.el.unselectable();

		this.cells = this.el.select("table.x-date-inner tbody td");
		this.textNodes = this.el.query("table.x-date-inner tbody span");

		this.mbtn = new Ext.Button({
			text: "&#160;",
			tooltip: this.monthYearText,
			renderTo: this.el.child("td.x-date-middle", true)
		});

		this.mbtn.on('click', this.showMonthPicker, this);
		this.mbtn.el.child(this.mbtn.menuClassTarget).addClass("x-btn-with-menu");

		var dt1 = new Date();
		var txt = '';

		var today = (new Date()).dateFormat(this.format);
		var todayBtn = new Ext.Button({
			renderTo: this.el.child("td.x-date-bottom", true),
			text: String.format(this.todayText, today),
			tooltip: String.format(this.todayTip, today),
			handler: this.selectToday,
			scope: this
		});

		if (Ext.isIE) {
			this.el.repaint();
		}
		this.update(this.value);
	},

	/**
	 * Method Name: update Description: as per Ext.DatePicker's update, except
	 * updates year label in its own cell Parameters: as per Ext.DatePicker's
	 * update Returns: n/a Throws: n/a
	 */
	update: function (date) {
		var vd = this.activeDate;
		this.activeDate = date;
		if (vd && this.el) {
			var t = date.getTime();
			if (vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear()) {
				this.cells.removeClass("x-date-selected");
				this.cells.each(function (c) {
					if (c.dom.firstChild.dateValue == t) {
						c.addClass("x-date-selected");
						setTimeout(function () {
							try {
								c.dom.firstChild.focus();
							} catch(e) {}
						},
						50);
						return false;
					}
				});
				return;
			}
		}
		var days = date.getDaysInMonth();
		var firstOfMonth = date.getFirstDateOfMonth();
		var startingPos = firstOfMonth.getDay() - this.startDay;

		if (startingPos <= this.startDay) {
			startingPos += 7;
		}

		var pm = date.add("mo", -1);
		var prevStart = pm.getDaysInMonth() - startingPos;

		var cells = this.cells.elements;
		var textEls = this.textNodes;
		days += startingPos;

		// convert everything to numbers so it's fast
		var day = 86400000;
		var d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart)).clearTime();
		var today = new Date().clearTime().getTime();
//		var sel = date.clearTime().getTime();
		var sel = date.getTime();
		var min = this.minDate ? this.minDate.clearTime() : Number.NEGATIVE_INFINITY;
		var max = this.maxDate ? this.maxDate.clearTime() : Number.POSITIVE_INFINITY;
		var ddMatch = this.disabledDatesRE;
		var ddText = this.disabledDatesText;
		var ddays = this.disabledDays ? this.disabledDays.join("") : false;
		var ddaysText = this.disabledDaysText;
		var format = this.format;

		var setCellClass = function (cal, cell) {
			cell.title = "";
			var t = d.getTime();
			cell.firstChild.dateValue = t;
			if (t == today) {
				cell.className += " x-date-today";
				cell.title = cal.todayText;
			}
			if (t == new Date(sel).clearTime().getTime()) {
				cell.className += " x-date-selected";
				setTimeout(function () {
					try {
						cell.firstChild.focus();
					} catch(e) {}
				},
				50);
			}
			// disabling
			if (t < min) {
				cell.className = " x-date-disabled";
				cell.title = cal.minText;
				return;
			}
			if (t > max) {
				cell.className = " x-date-disabled";
				cell.title = cal.maxText;
				return;
			}
			if (ddays) {
				if (ddays.indexOf(d.getDay()) != -1) {
					cell.title = ddaysText;
					cell.className = " x-date-disabled";
				}
			}
			if (ddMatch && format) {
				var fvalue = d.dateFormat(format);
				if (ddMatch.test(fvalue)) {
					cell.title = ddText.replace("%0", fvalue);
					cell.className = " x-date-disabled";
				}
			}
		};

		var i = 0;
		for (; i < startingPos; i++) {
			textEls[i].innerHTML = (++prevStart);
			d.setDate(d.getDate() + 1);
			cells[i].className = "x-date-prevday";
			setCellClass(this, cells[i]);
		}
		for (; i < days; i++) {
			intDay = i - startingPos + 1;
			textEls[i].innerHTML = (intDay);
			d.setDate(d.getDate() + 1);
			cells[i].className = "x-date-active";
			setCellClass(this, cells[i]);
		}
		var extraDays = 0;
		for (; i < 42; i++) {
			textEls[i].innerHTML = (++extraDays);
			d.setDate(d.getDate() + 1);
			cells[i].className = "x-date-nextday";
			setCellClass(this, cells[i]);
		}

		this.mbtn.setText(this.monthNames[date.getMonth()] + " " + date.getFullYear());

		if (!this.internalRender) {
			var main = this.el.dom.firstChild;
			var w = main.offsetWidth;
			this.el.setWidth(w + this.el.getBorderWidth("lr"));
			Ext.fly(main).setWidth(w);
			this.internalRender = true;
			// opera does not respect the auto grow header center column
			// then, after it gets a width opera refuses to recalculate
			// without a second pass
			if (Ext.isOpera && !this.secondPass) {
				main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth + main.rows[0].cells[2].offsetWidth)) + "px";
				this.secondPass = true;
				this.update.defer(10, this, [date]);
			}
		}
	},

	/** *** Public Instance Variables **** */

	/**
	 * Variable Name: nextYearText, prevYearText Description: Hover text for the
	 * previous year and next year arrow changers Default: as shown Type: string
	 */
	nextYearText: 'Next Year (Control+Up)',
	prevYearText: 'Previous Year (Control+Down)'
});

/**
 * Class Name: DatetimeItem Inherits From: Ext.menu.Adapter Contains:
 * DatetimePicker Purpose: Effectively overrides Ext.menu.DateItem so that it
 * contains DatetimePicker instead of Ext.DatePicker Note: ORIGINAL and NEW
 * comments are used to denote what differs from Ext.menu.DateItem
 */
jty.date.DatetimeItem = function (config) {
	// ORIGINAL:
	// Ext.menu.DateItem.superclass.constructor.call(this, new
	// Ext.DatePicker(config), config);
	// NEW:
	jty.date.DatetimeItem.superclass.constructor.call(this, new jty.date.DatetimePicker(config), config);
	// END NEW
	this.picker = this.component;
	this.addEvents({
		select: true
	});

	this.picker.on("render", function (picker) {
		picker.getEl().swallowEvent("click");
		picker.container.addClass("x-menu-date-item");
        if(Ext.isGecko){     
            picker.el.dom.childNodes[0].style.width = '185px';     
            picker.el.dom.style.width = '185px';     
        } 
	});

	this.picker.on("select", this.onSelect, this);
};

Ext.extend(jty.date.DatetimeItem, Ext.menu.Adapter, {
	onSelect: function (picker, date) {
		this.fireEvent("select", this, date, picker);
		// ORIGINAL:
		// Ext.menu.DateItem.superclass.handleClick.call(this);
		// NEW:
		jty.date.DatetimeItem.superclass.handleClick.call(this);
		// END NEW
	}
});

/**
 * Class Name: DatetimeMenu Inherits From: Ext.menu.Menu Contains: DatetimeItem
 * Purpose: Effectively overrides Ext.menu.DateMenu so that it contains
 * DatetimeItem instead of Ext.menu.DateItem Note: ORIGINAL and NEW comments are
 * used to denote what differs from Ext.menu.DateMenu
 */
DatetimeMenuPlugin = function (config) {
	// ORIGINAL:
	// Ext.menu.DateMenu.superclass.constructor.call(this, config);
	// this.plain = true;
	// var di = new Ext.menu.DateItem(config);
	// NEW:
	DatetimeMenuPlugin.superclass.constructor.call(this, config);
	this.plain = true;
	var di = new jty.date.DatetimeItem(config);
	// END NEW
	this.add(di);
	this.picker = di.picker;
	this.relayEvents(di, ["select"]);
    this.on('beforeshow', function(){
	    if(this.picker){
	        this.picker.hideMonthPicker(true);
			var startOrFinish = this.startOrFinish;
			var uuid = this.uuid;
			if(startOrFinish){//显示之前选中早中晚的其中一个
				var h = this.picker.getValue().getHours();
				if(startOrFinish == 'start'){
					if(h == 0){
						var morning_radio = Ext.getDom('start_morning_time_radio'+uuid);
						if(morning_radio){
							morning_radio.checked = 'checked';
						}
					}else if(h == 11){
						var midday_radio = Ext.getDom('start_midday_time_radio'+uuid);
						if(midday_radio){
							midday_radio.checked = 'checked';
						}
					}
				}else if(startOrFinish == 'finish'){
					if(h == 11){
						var midday_radio = Ext.getDom('finish_midday_time_radio'+uuid);
						if(midday_radio){
							midday_radio.checked = 'checked';
						}
					}else if(h == 23){
						var evening_radio = Ext.getDom('finish_evening_time_radio'+uuid);
						if(evening_radio){
							evening_radio.checked = 'checked';
						}
					}
				}
			}
	    }
	}, this);
};
Ext.extend(DatetimeMenuPlugin, Ext.menu.Menu);
