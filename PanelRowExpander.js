/*jslint forin: true */
/**
*    A RowExpander changed from RowExpander.js in the Ext examples and some ideas taken 
*    from the forum (http://extjs.com/forum/showthread.php?t=21017&page=3).
*
*    Override the createExpandingRowPanelItems function to make Ext expanded row content
*    (as opposed to using Ext.Template to make the expanded row content).
*
*    If config.store is passed in, pass a record for the row from that store instead 
*    of the grid store into the createExpandingRowPanelItems function.
*
*    Renamed and incorporated into ext-extensions by jjulian 7/2009. Thanks to wolf.
*/
Ext.grid.PanelRowExpander = function(config){
    Ext.apply(this, config);
    Ext.grid.PanelRowExpander.superclass.constructor.call(this);

    this.state = {};

    this.addEvents({
        beforeexpand : true,
        expand: true,
        beforecollapse: true,
        collapse: true
    });
    
    this.expandingRowPanels = {};
};

Ext.extend(Ext.grid.PanelRowExpander, Ext.util.Observable, {
    header: "",
    width: 20,
    sortable: false,
    fixed:true,
    dataIndex: '',
    id: 'expander',

    getRowClass : function(record, rowIndex, rowParams, ds){
        // cols: The column count to apply to the body row's TD colspan attribute (defaults to the current column count of the grid).
        rowParams.cols = rowParams.cols-1; // make it the width of the whole row
        return this.state[record.id] ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed';
    },

    init : function(grid){
        this.grid = grid;

        var view = grid.getView();
        view.getRowClass = this.getRowClass.createDelegate(this);

        view.enableRowBody = true;

        grid.on('render', function(){
            view.mainBody.on( 'mousedown', this.onMouseDown, this );
            view.on('rowupdated', this.updateRow, this);
        }, this);
        this.relayEvents(grid, ['resize']);
        
        // store
        grid.getStore().on("load", function(store, records, options){
              Ext.select('div.x-grid3-row-expanded').replaceClass('x-grid3-row-expanded', 'x-grid3-row-collapsed');
              this.state = {};
              for (var id in this.expandingRowPanels) {
                this.expandingRowPanels[id].destroy();
              }
              this.expandingRowPanels = {};
            }, this);
        
        if (this.store) {
          this.store.load(); // load here instead of in beforeExpand cuz that would wipe out additions to store
        }
    },

    updateRow : function(view, rowIndex, rec){
      // console.log('expander: id '+rec.id+' updated row='+rowIndex);
      if (this.expandingRowPanels[rec.id]) {
        //the expander html element was destroyed by the grid update. destroy the panel
        this.expandingRowPanels[rec.id].destroy();
        this.expandingRowPanels[rec.id] = null;
        var open = Ext.fly(view.getRow(rowIndex)).hasClass('x-grid3-row-expanded');
        if (open) {
          //it *was* open...so re-open it
          this.expandRow(rowIndex);
        }
      }
    },
    
    onMouseDown : function( e, t ) {
        if(t.className == 'x-grid3-row-expander'){
            e.stopEvent();
            var row = e.getTarget('.x-grid3-row');
            this.toggleRow(row);
        }
    },

    // renders the column that will be placed in the grid (the +/- button)
    renderer : function(v, p, record, rowIndex){
        p.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-expander"> </div>';
    },

    beforeExpand : function(record, rowBody, rowIndex){
        var isContinue = true;
        if(this.fireEvent('beforeexpand', this, record, rowBody, rowIndex, this.store) !== false){
            if(rowBody.innerHTML === '') {
                this.createExpandingRowPanel( record, rowBody, rowIndex );
            }
        } else {
            isContinue = false;
        }
        
        return isContinue;
    },

    toggleRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        this[Ext.fly(row).hasClass('x-grid3-row-collapsed') ? 'expandRow' : 'collapseRow'](row);
    },

    expandRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        // if using additional store passed in config, pass record from it instead of from the grid store
        var recordToPass = this.store ? this.store.getAt(row.rowIndex) : record; 
        var rowBody = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
        if(this.beforeExpand(recordToPass, rowBody, row.rowIndex)){
            this.state[record.id] = true;
            Ext.fly(row).replaceClass('x-grid3-row-collapsed', 'x-grid3-row-expanded');
            this.fireEvent('expand', this, recordToPass, rowBody, row.rowIndex);
        }
    },

    collapseRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        // if using additional store passed in config, pass record from it instead of from the grid store
        var recordToPass = this.store ? this.store.getAt(row.rowIndex) : record; 
        var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
        if(this.fireEvent('beforecollapse', this, recordToPass, body, row.rowIndex) !== false){
            this.state[record.id] = false;
            Ext.fly(row).replaceClass('x-grid3-row-expanded', 'x-grid3-row-collapsed');
            this.fireEvent('collapse', this, recordToPass, body, row.rowIndex);
        }
    },
    
   createExpandingRowPanel: function( record, rowBody, rowIndex ) {
        // record.id is more stable than rowIndex for panel item's key; rows can be deleted.
        var panelItemIndex = record.id;
 
        // Add a new panel to the row body if not already there
        if ( !this.expandingRowPanels[panelItemIndex] ) {
            this.expandingRowPanels[panelItemIndex] = new Ext.Panel(
                {
                    layout:'fit', // Note, use 'form' to get form field labels to show
                    border: false,
                    bodyBorder: false,
                    items: this.createExpandingRowPanelItems( record, rowIndex )
                }
            );
            // 2009-07-26 12:52am jjulian When renderTo is specified in the config above, it
            // all happens *too fast* and the layout does not know that the element we are
            // rendering to actually has a size > 0. 
            (function() {
              this.expandingRowPanels[panelItemIndex].render(rowBody);
            }).defer(100, this);
            
            // Add support for passing along grid resize events to the expander panel
            this.on('resize', function() {
              this.expandingRowPanels[panelItemIndex].fireEvent('resize');
            });
        }
    },
    
    /**
    * Override this method to put Ext form items into the expanding row panel.
    * @return Array of panel items.
    */
    createExpandingRowPanelItems: function( record, rowIndex ) {
        var panelItems = [];
        
        return panelItems;
    }
    
}); 

