Ext.namespace('Ext.ux');

Ext.ux.ComboBoxCheckTree = function(){
	this.treeId = Ext.id()+'-tree';
	this.maxHeight = arguments[0].maxHeight || arguments[0].height || this.maxHeight;
	this.tpl = new Ext.Template('<tpl for="."><div style="height:'+this.maxHeight+'px"><div id="'+this.treeId+'"></div></div></tpl>');
	this.store = new Ext.data.SimpleStore({fields:[],data:[[]]});
	this.selectedClass = '';
	this.mode = 'local';
	this.triggerAction = 'all';
	this.onSelect = Ext.emptyFn;
	this.editable = false;
	this.beforeBlur = Ext.emptyFn;

	//all:所有结点都可选中
	//exceptRoot：除根结点，其它结点都可选（默认）
	//folder:只有目录（非叶子和非根结点）可选
	//leaf：只有叶子结点可选
	this.selectNodeModel = arguments[0].selectNodeModel || 'exceptRoot';

	/*
	 * single单选 （默认）
	 * multiple 多选的
	 */
	this.selectModel = arguments[0].selectModel || 'single';


	this.addEvents('afterchange');

	Ext.ux.ComboBoxCheckTree.superclass.constructor.apply(this, arguments);

}

Ext.extend(Ext.ux.ComboBoxCheckTree,Ext.form.ComboBox, {

	expand : function(){
		Ext.ux.ComboBoxCheckTree.superclass.expand.call(this);
		if(this.tree.rendered){
			return;
		}

		Ext.apply(this.tree,{height:this.maxHeight, width:(this.listWidth||this.width-(Ext.isIE?3:0))-2, border:false, autoScroll:true});
		if(this.tree.xtype){
			this.tree = Ext.ComponentMgr.create(this.tree, this.tree.xtype);
		}
		this.tree.render(this.treeId);

		var root = this.tree.getRootNode();
		if(!root.isLoaded())
			root.reload();
		this.tree.on('checkchange',function(node){
				this.setValues(node);
		}, this);
	},

	setValues : function(node){
		var nodes = this.tree.getChecked();
		var value = [];
		var text = [];
		for (var i = 0; i < nodes.length; i++) {
			value.push(nodes[i].id);
			text.push(nodes[i].text);
		}
		this.setValue(value, text);

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


	setDoubleValues : function(values,v){
		if(values){
			if(Ext.isArray(values)){
				for(var i = 0, len = values.length; i < len; i++){
					var v = values[i];
					var f = this.findField(v.id);
					if(f){
						f.setValue(v.value);
						if(this.trackResetOnLoad){
							f.originalValue = f.getValue();
						}
					}
				}
			}else{
				var field, id;
				for(id in values){
					if(!Ext.isFunction(values[id]) && (field = this.findField(id))){
						field.setValue(values[id]);
						if(this.trackResetOnLoad){
							field.originalValue = field.getValue();
						}
					}
				}
			}
			return this;
		}else {
			var text = v;
			if(this.valueField){
				var r = this.findRecord(this.valueField, v);
				if(r){
					text = r.data[this.displayField];
				}else if(Ext.isDefined(this.valueNotFoundText)){
					text = this.valueNotFoundText;
				}
			}
			this.lastSelectionText = text;
			if(this.hiddenField){
				this.hiddenField.value = Ext.value(v, '');
			}
			Ext.form.ComboBox.superclass.setValue.call(this, text);
			this.value = v;
			return this;
		}
	},

	//重写comboBox组件的setValue()的方法，目的是获得组件的valueField的值
	setCategoryValue : function(v){
		var text = v;
		if(this.valueField){
			var r = this.findRecord(this.valueField, v);
			if(r){
				text = r.data[this.displayField];
			}else if(Ext.isDefined(this.valueNotFoundText)){
				text = this.valueNotFoundText;
			}
		}
		this.lastSelectionText = text;
		if(this.hiddenField){
			this.hiddenField.value = Ext.value(v, '');
		}
		Ext.form.ComboBox.superclass.setValue.call(this, text);
		this.value = v;
		return this;
	},


	getValue : function(){
		return typeof this.value != 'undefined' ? this.value : '';
	},

	getNode : function(){
		return this.node;
	},

	clearValue : function(){
		Ext.ux.ComboBoxCheckTree.superclass.clearValue.call(this);
		this.node = null;
	},
	// 重写onViewClick，使展开树结点是不关闭下拉框
	onViewClick : function(doFocus) {
		var index = this.view.getSelectedIndexes()[0], s = this.store, r = s.getAt(index);
		if (r) {
			this.onSelect(r, index);
		}
		if (doFocus !== false) {
			this.el.focus();
		}
	},
	// private
	destroy: function() {
		Ext.ux.ComboBoxCheckTree.superclass.destroy.call(this);
		Ext.destroy([this.node,this.tree]);
		delete this.node;
	}
});

Ext.reg('combochecktree', Ext.ux.ComboBoxCheckTree);