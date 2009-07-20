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
  }
});
