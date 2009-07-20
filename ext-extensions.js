Ext.applyIf(Ext,{

  /*
   * Given an array, return a single array containing all of the elements of the
   * array and it's children, with no sub-arrays. It's flattened.
   */
  flatten: function(array) {
    if (Ext.isArray(array)) {
      var a = [];
      Ext.each(array, function(el) {
        if (Ext.isArray(el)) {
          a = a.concat(Ext.flatten(el));
        } else {
          a.push(el);
        }
      });
      return a;
    } else {
      return array;
    }
  },
  
  /*
   * Flatten a Node data structure into an array of Nodes. A Node data structure
   * is an array of Nodes, and each node can contain another array of Nodes via
   * the 'children' attribute.
   *
   * The new Nodes will only retain attributes 'id', 'text', 'leaf'. If you need other
   * attributes to be retained, pass their names in an array in extraAttrs.
   */
  flattenTree: function(treeArray, extraAttrs) {
    var a = [];
    Ext.each(treeArray, function(el) {
      var obj = {id: el.id, text: el.text, leaf: el.leaf};
      if (extraAttrs) {
        Ext.each(extraAttrs, function(attr) {
          obj[attr] = el[attr];
        });
      }
      a.push(obj);
      if (el.children) {
        a = a.concat(Ext.flattenTree(el.children, extraAttrs));
      }
    });
    return a;
  }

});
