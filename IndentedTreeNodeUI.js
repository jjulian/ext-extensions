/**
 * @class Ext.tree.IndentedTreeNodeUI
 * This class provides an alternate UI implementation for Ext TreeNodes. Node text
 * will wrap across multiple lines and will be indented.
 * <br/>
 * Since text can span multiple "rows", it's advised that you set <code>lines: false</code>
 * in your TreePanel config when using this ui. 
 * <br/>
 * To use, set <code>uiProvider: Ext.tree.IndentedTreeNodeUI</code> on every node you load.
 * You will also need some css to ensure the new tree nodes look like they should. At the minimum:
 * <pre><code>
.x-tree-node table {
  font: normal 11px arial, tahoma, helvetica, sans-serif;
  line-height: 17px;
}
 </code></pre>
 */
Ext.tree.IndentedTreeNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {

  renderElements : function(n, a, targetNode, bulkRender){
      // add some indent caching, this helps performance when rendering a large tree
      this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

      var cb = typeof a.checked == 'boolean';
      var href = a.href ? a.href : Ext.isGecko ? "" : "#";
      var buf = ['<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf x-unselectable ', a.cls,'" unselectable="on">',
          '<table><tbody><tr style="vertical-align:top;"><td>',
          '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
          '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
          '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on" />',
          cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
          '</td><td class="x-tree-node-text-cell" style="white-space:normal;"><a hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
           a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '><span unselectable="on" style="padding-left:0;">',n.text,"</span></a></td></tr></tbody></table></div>",
          '<ul class="x-tree-node-ct" style="display:none;"></ul>',
          "</li>"].join('');

      var nel;
      if(bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())){
          this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
      }else{
          this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
      }
      
      this.elNode = this.wrap.childNodes[0];
      this.ctNode = this.wrap.childNodes[1];
      var cs = this.elNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes;
      this.indentNode = cs[0];
      this.ecNode = cs[1];
      this.iconNode = cs[2];
      var index = 3;
      if(cb){
          this.checkbox = cs[3];
          // fix for IE6
          this.checkbox.defaultChecked = this.checkbox.checked;
          index++;
      }
      this.anchor = this.elNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1].firstChild;
      this.textNode = this.anchor.firstChild;
  }

});

Ext.override(Ext.tree.TreeEventModel, {
  getNodeTarget : function(e){
      var t = e.getTarget('.x-tree-node-icon', 1);
      if(!t){
          t = e.getTarget('.x-tree-node-el', 7); //changed from depth of 6 to 7
      }
      return t;
  }
});

