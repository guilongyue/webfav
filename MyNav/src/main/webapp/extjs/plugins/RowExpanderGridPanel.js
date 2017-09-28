Ext.namespace('Ext.ux');
Ext.ux.RowExpanderGridView = Ext.extend(Ext.grid.GridView, {
	// private
	initTemplates : function() {
		Ext.ux.RowExpanderGridView.superclass.initTemplates.call(this);
	},
	onRowSelect : function(row) {
		this.addRowClass(row, "x-grid3-row-selected");
		if (this.isRowExpander()) {
			this.addRowExpanderClass(row, 'x-grid3-row-expander-selected');
		}
	},
	onRowDeselect : function(row) {
		this.removeRowClass(row, "x-grid3-row-selected");
		if (this.isRowExpander()) {
			this.removeRowExpanderClass(row, 'x-grid3-row-expander-selected');
		}
	},
	//添加展开部分样式（选中情况下）
	addRowExpanderClass : function(row, cls) {
		var r = this.getRow(row);
		var d = new Ext.Element(r, true);
		if (d) {//
			var expander = d.child('.x-grid3-row-body', true);
			if (expander) {
				this.fly(expander).addClass(cls);
			}
		}
	},
	//移除展开部分样式（选中情况下）
	removeRowExpanderClass : function(row, cls) {
		var r = this.getRow(row);
		var d = new Ext.Element(r, true);
		if (d) {
			var expander = d.child('.x-grid3-row-body');
			if (expander) {
				this.fly(expander).removeClass(cls);
			}
		}
	},
	//判断是否添加了行展开插件
	isRowExpander : function() {
		if (this.grid.plugins) {
			if (Ext.isArray(this.grid.plugins)) {
				for (var i = 0, len = this.grid.plugins.length; i < len; i++) {
					if (this.grid.plugins[i] instanceof Ext.grid.RowExpander) {
						return true;
					}
				}
			} else {
				if (this.grid.plugins instanceof Ext.grid.RowExpander) {
					return true;
				}
			}
		}
		return false;
	}
});

Ext.ux.RowExpanderGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {
	// private
	initComponent : function() {
		Ext.ux.RowExpanderGridPanel.superclass.initComponent.call(this);
	},
	getView : function() {
		if (!this.view) {
			this.view = new Ext.ux.RowExpanderGridView(this.viewConfig);
		}
		return this.view;
	},
	startEditing : function(row, col) {
		this.stopEditing();
		if (this.colModel.isCellEditable(col, row)) {
			//	this.view.ensureVisible(row, col, true);
			var r = this.store.getAt(row);
			var field = this.colModel.getDataIndex(col);
			var e = {
				grid : this,
				record : r,
				field : field,
				value : r.data[field],
				row : row,
				column : col,
				cancel : false
			};
			if (this.fireEvent("beforeedit", e) !== false && !e.cancel) {
				this.editing = true;
				var ed = this.colModel.getCellEditor(col, row);
				if (!ed.rendered) {
					ed.render(this.view.getEditorParent(ed));
				}
(function		() {
					ed.row = row;
					ed.col = col;
					ed.record = r;
					ed.on("complete", this.onEditComplete, this, {
						single : true
					});
					ed.on("specialkey", this.selModel.onEditorKey, this.selModel);
					this.activeEditor = ed;
					var v = this.preEditValue(r, field);
					ed.startEdit(this.view.getCell(row, col).firstChild, v === undefined ? '' : v);
				}).defer(50, this);
			}
		}
	}
});