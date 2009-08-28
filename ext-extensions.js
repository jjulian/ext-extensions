/*
The MIT License

Copyright (c) 2009 Jonathan Julian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

The latest version of this software can always be found at:
http://github.com/jjulian/ext-extensions/tree/master

*/

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
   */
  flattenTree: function(treeArray) {
    var a = [];
    Ext.each(treeArray, function(el) {
      a.push(el);
      if (el.children) {
        a = a.concat(Ext.flattenTree(el.children));
      }
    });
    return a;
  }

});

/*
 * Get a form field component by it's 'name'. Anything within this
 * panel with a 'name' attribute will match.
 */
Ext.override(Ext.form.FormPanel, {
  findField: function(value) {
    var array = this.findBy(function(component) {
      if (component.name === value) {
        return true;
      }
    });
    return array[0];
  }
});

