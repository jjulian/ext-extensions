Ext.override(Ext.grid.GridView, {
  autoExpand: function(preventUpdate){
    var g = this.grid, cm = this.cm;
    if (typeof g.autoExpandColumn === 'string') {
      var cindex = cm.findColumnIndex(g.autoExpandColumn);
      if (cindex === -1) {
        throw 'could not find column ' + g.autoExpandColumn;
      } else {
        g.autoExpandColumn = cindex;
      }
    }
    if(!this.userResized && (g.autoExpandColumn || g.autoExpandColumn === 0)){
        var tw = cm.getTotalWidth(false);
        var aw = this.grid.getGridEl().getWidth(true)-this.scrollOffset;
        if(tw != aw){
            var ci = cm.getIndexById(g.autoExpandColumn);
            var currentWidth = cm.getColumnWidth(ci);
            var cw = Math.min(Math.max(((aw-tw)+currentWidth), g.autoExpandMin), g.autoExpandMax);
            if(cw != currentWidth){
                cm.setColumnWidth(ci, cw, true);
                if(preventUpdate !== true){
                    this.updateColumnWidth(ci, cw);
                }
            }
        }
    }
  }
});

Ext.override(Ext.grid.GridView, {
  render: function(){
    if(this.autoFill){
        this.fitColumns(true, true);
    }else if(this.forceFit){
        this.fitColumns(true, false);
    }else if(this.grid.autoExpandColumn || this.grid.autoExpandColumn === 0){
        this.autoExpand(true);
    }

    this.renderUI();
  }
});

