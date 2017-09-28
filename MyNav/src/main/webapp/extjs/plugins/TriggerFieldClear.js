Ext.namespace('Ext.ux')
/**
 * 带清除按钮的文本框
 * @class Ext.ux.TriggerFieldClear
 * @extends Ext.form.TriggerField
 */
Ext.ux.TriggerFieldClear = Ext.extend(Ext.form.TriggerField, {
	clearId : '', //清除隐藏列的ID号(如果有多个隐藏列请用“,”号隔开)
	clearTitle :'',// 删除按钮的提示信息
	readOnly : true,
	anchor : '99%',
	hideTrigger : true,
	initComponent : function() {
		Ext.ux.TriggerFieldClear.superclass.initComponent.call(this);
		this.triggerConfig = {
			tag : 'span',
			cls : 'x-form-twin-triggers',
			cn : [{
				tag : "img",
				title : this.clearTitle,
				style : 'width:15px;height:15px;margin-left:-19px;vertical-align:middle;cursor:pointer;',
				src : 'images/business/ticket/fileDel.gif'
			}]
		};
		this.on('focus',function(obj){
			if(obj.getValue()){
				obj.trigger.show();			
			}
		});
		this.on('blur',function(obj){
			obj.trigger.hide();
		});
	},
	onTriggerClick : function() {
		if(this.clearId){
			var idArray = this.clearId.split(",");
			for(i=0 ;i<idArray.length;i++){
				Ext.getCmp(idArray[i]).setValue(null);
			}
		}
		this.trigger.hide();
		this.setValue(null);
		this.focus();
	}
});
