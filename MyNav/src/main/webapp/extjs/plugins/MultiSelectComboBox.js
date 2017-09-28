Ext.namespace('Ext.ux');
Ext.ux.CheckBoxDataView = Ext.extend(Ext.DataView, {
	rowSelect : false,
	checkedCls : 'x-form-check-checked',
	initComponent : function() {
		Ext.ux.CheckBoxDataView.superclass.initComponent.call(this);
	},
	check : function(e) {
		var item = e.getTarget(this.itemSelector, this.el);
		if (item) {
			var index = this.indexOf(item);
			if (this.onItemClick(item, index, e, true) !== false) {
				this.fireEvent("click", this, index, item, e);
			}
		}
	},
	// private
	onClick : function(e) {
		if (this.rowSelect) {
			this.check(e);
		} else {
			var checkor = e.getTarget(this.itemCheckor, this.el);
			if (checkor) {
				this.check(e);
			}
		}
	},
	doSingleSelection : function(item, index, e, isClick) {
		if (this.isSelected(index)) {
			this.deselect(index);
		} else {
			this.select(index, false, false, isClick);
		}
	},
	onItemClick : function(item, index, e, isClick) {
		if (this.fireEvent("beforeclick", this, index, item, e) === false) {
			return false;
		}
		if (this.multiSelect) {
			this.doMultiSelection(item, index, e, isClick);
			e.preventDefault();
		} else if (this.singleSelect) {
			this.doSingleSelection(item, index, e, isClick);
			e.preventDefault();
		}
		return true;
	},
	// private
	doMultiSelection : function(item, index, e, isClick) {
		if (this.isSelected(index)) {
			this.deselect(index);
		} else {
			this.select(index, true, false, isClick);
		}
	},
	select : function(nodeInfo, keepExisting, suppressEvent, isClick) {
		if (!isClick) {
			return;
		}
		if (Ext.isArray(nodeInfo)) {
			if (!keepExisting) {
				this.clearSelections(true);
			}
			for (var i = 0, len = nodeInfo.length; i < len; i++) {
				this.select(nodeInfo[i], true, true);
			}
			if (!suppressEvent) {
				this.fireEvent("selectionchange", this, this.selected.elements);
			}
		} else {
			var node = this.getNode(nodeInfo);
			if (!keepExisting) {
				this.clearSelections(true);
			}
			if (node && !this.isSelected(node)) {
				if (this.fireEvent("beforeselect", this, node, this.selected.elements) !== false) {
					Ext.fly(node).addClass([this.selectedClass, this.checkedCls]);
					this.selected.add(node);
					this.last = node.viewIndex;
					if (!suppressEvent) {
						this.fireEvent("selectionchange", this, this.selected.elements);
					}
				}
			}
		}
	},
	deselect : function(node) {
		if (this.isSelected(node)) {
			node = this.getNode(node);
			this.selected.removeElement(node);
			if (this.last == node.viewIndex) {
				this.last = false;
			}
			Ext.fly(node).removeClass([this.selectedClass, this.checkedCls]);
			this.fireEvent("selectionchange", this, this.selected.elements);
		}
	},
	clearSelections : function(suppressEvent, skipUpdate) {
		if ((this.multiSelect || this.singleSelect) && this.selected.getCount() > 0) {
			if (!skipUpdate) {
				this.selected.removeClass([this.selectedClass, this.checkedCls]);
			}
			this.selected.clear();
			this.last = false;
			if (!suppressEvent) {
				this.fireEvent("selectionchange", this, this.selected.elements);
			}
		}
	},
	addSelectedClass : function(records) {
		this.clearSelections(false, false);
		for (var i = 0; i < records.length; i++) {
			var index = this.store.indexOf(records[i]);
			var node = this.getNode(index);
			this.selected.add(node);
		}
		this.selected.addClass([this.selectedClass, this.checkedCls]);
	}
});

//多选下拉框
// 增加了个属性：showTip : 是否在下拉框中显示Value的tip提示，对于Value值比较长时比较适合。 --add by xlj 2015-01-14
Ext.ux.MultiSelectComboBox = Ext.extend(Ext.form.ComboBox, {
	showTip : false,
	initComponent : function() {
		Ext.ux.MultiSelectComboBox.superclass.initComponent.call(this);
	},
	initList : function() {
		if (!this.list) {
			var cls = 'x-combo-list';
			var checkedCls = '';
			var uncheckedCls = '';
			this.list = new Ext.Layer({
				shadow : this.shadow,
				cls : [cls, this.listClass].join(' '),
				constrain : false
			});

			var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
			this.list.setWidth(lw);
			this.list.swallowEvent('mousewheel');
			this.assetHeight = 0;

			if (this.title) {
				this.header = this.list.createChild({
					cls : cls + '-hd',
					html : this.title
				});
				this.assetHeight += this.header.getHeight();
			}

			this.innerList = this.list.createChild({
				cls : cls + '-inner'
			});
			//this.innerList.on('mouseover', this.onViewOver, this);
			//this.innerList.on('mousemove', this.onViewMove, this);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

			if (this.pageSize) {
				this.footer = this.list.createChild({
					cls : cls + '-ft'
				});
				this.pageTb = new Ext.PagingToolbar({
					store : this.store,
					pageSize : this.pageSize,
					renderTo : this.footer
				});
				this.assetHeight += this.footer.getHeight();
			}

			this.tpl = '<tpl for="."><div class="'
				+ cls
				+ '-item" '+ (this.showTip ? 'ext:qtip="{'+this.displayField+'}"':'')+'>' +
						'<img class="x-form-check" src="extjs/resources/images/default/s.gif"><input type=checkbox class=" x-form-checkbox x-form-field x-hidden">&nbsp;&nbsp;{'
				+ this.displayField + '}</div></tpl>';
			this.view = new Ext.ux.CheckBoxDataView({
				applyTo : this.innerList,
				tpl : this.tpl,
				multiSelect : true,
				rowSelect : this.rowSelect,
				selectedClass : this.selectedClass,
				itemSelector : this.itemSelector || '.' + cls + '-item',
				itemCheckor : '.x-form-check'
			});
			this.view.on('click', this.onViewClick, this);
			if (this.store) {
				this.view.setStore(this.store);
			}
			if (this.resizable) {
				this.resizer = new Ext.Resizable(this.list, {
					pinned : true,
					handles : 'se'
				});
				this.resizer.on('resize', function(r, w, h) {
					this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;
					this.listWidth = w;
					this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
					this.restrictHeight();
				}, this);
				this[this.pageSize ? 'footer' : 'innerList'].setStyle('margin-bottom', this.handleHeight + 'px');
			}
			//=============
			//this.on('collapse', this.onCollapse, this);
			this.on('expand', this.onExpand, this);
		}
	},
	onExpand : function() {
		var rs = this.getSelectRecords();
		this.view.addSelectedClass(rs);
	},
	doSelectRecords : function(rs) {
		this.view.addSelectedClass(rs);
		this.setValues(rs);
	},
	setValues : function(records) {
		if (!records) {
			records = this.view.getSelectedRecords();
		}
		var value = [];
		var text = [];
		for (var i = 0; i < records.length; i++) {
			value.push(records[i].data[this.valueField]);
			text.push(records[i].data[this.displayField]);
		}
		this.setValue(value, text);

	},
	onViewClick : function(doFocus) {
		var index = this.view.getSelectedIndexes()[0];
		var r = this.store.getAt(index);
		this.onSelect(r, index);
	},
	// private
	onSelect : function(record, index) {
		if (this.fireEvent('beforeselect', this, record, index) !== false) {
			this.setValues();
			this.fireEvent('select', this, record, index);
		}
	},
	beforeBlur : function() {
		var val = this.getRawValue();
		if (this.forceSelection) {
			if (val.length > 0 && val != this.emptyText) {
				this.el.dom.value = this.lastSelectionText === undefined ? '' : this.lastSelectionText;
				this.applyEmptyText();
			} else {
				this.clearValue();
			}
		} else {
			var rec = this.findRecord(this.displayField, val);
			if (rec) {
				val = rec.get(this.valueField || this.displayField);
			}
			this.setValue(val);
		}
	},
	getSelectRecords : function() {
		var rec = [];
		if (this.valueField && this.value) {
			for (var i = 0; i < this.value.length; i++) {
				var r = this.findRecord(this.valueField, this.value[i])
				if (r) {
					rec.push(r);
				}
			}
		}
		return rec;
	},
	setValue : function(v, t) {
		if (!Ext.isArray(v)) {
			v = [v];
		}
		if (this.hiddenField) {
			this.hiddenField.value = v;
		}
		if (t == null || t == undefined) {
			t = this.getText(v);
		} else if (!Ext.isArray(t)) {
			t = [t];
		}

		this.lastSelectionText = t;
		if (this.hiddenField) {
			this.hiddenField.value = v;
		}
		Ext.form.ComboBox.superclass.setValue.call(this, t);
		this.value = v;
	},
	getText : function(v) {
		var t;
		if (this.valueField) {
			t = [];
			for (var i = 0; i < v.length; i++) {
				var r = this.findRecord(this.valueField, v[i]);
				if (r) {
					t.push(r.data[this.displayField]);
				}
			}
			if (t.length == 0 && this.valueNotFoundText !== undefined) {
				t.push(this.valueNotFoundText);
			}
		}
		return t && t.length > 0 ? t : v;
	}
});
Ext.reg('multiselect', Ext.ux.MultiSelectComboBox);