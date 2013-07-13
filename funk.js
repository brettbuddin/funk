(function() {
    var root   = this,
        _obj   = {
            toString: Object.prototype.toString
        },
        _array = {
            map:    Array.prototype.map,
            reduce: Array.prototype.reduce,
            slice:  Array.prototype.slice,
            filter: Array.prototype.filter
        }

    // Converts an n-ary function into a variadic function.
    // Arguments:
    //      fn - n-ary function
    // Examples:
    //      var one = variadic(function(args) { 
    //          return args; 
    //      });
    //
    //      fn()              //=> []
    //      fn('a')           //=> ['a']
    //      fn('a', 'b')      //=> ['a', 'b']
    //      fn('a', 'b', 'c') //=> ['a', 'b', 'c']
    //
    //      var two = variadic(function(one, rest) { 
    //          return [one, rest]; 
    //      });
    //
    //      fn()              //=> [undefined, []] 
    //      fn('a')           //=> ['a', []]
    //      fn('a', 'b')      //=> ['a', ['b']]
    //      fn('a', 'b', 'c') //=> ['a', ['b', 'c']]
    //
    function variadic(fn) {
        var arity = fn.length;

        function required(list) {
            var zone      = arity - 1,
                disparity = zone - list.length,
                out       = list.slice(0, zone);

            for (var i = 0; i < disparity; i++) {
                out.push(undefined);
            }

            return out;
        }

        function rest(list) {
            return list.slice(arity - 1);
        }

        return function() {
            var args = _array.slice.call(arguments);

            if (arity === 1) {
                return fn.apply(this, [args]);
            } else {
                var applyRest  = [rest(args)],
                    applyArgs  = required(args).concat(applyRest);

                return fn.apply(this, applyArgs);
            }
        }
    }

    // Applies a given unary function to each item in a list.
    // Arguments:
    //      list - array
    //      fn   - unary function
    // Examples:
    //      map([1, 2, 3], function(x) { 
    //          return x * 2; 
    //      });
    //      //=> [2, 4, 6]
    //
    function map(list, fn) {
        return _array.map.call(list, fn);
    }

    // Aggregates the values in the list given by the given binary function.
    // Arguments:
    //      list    - array
    //      fn      - binary function
    //      initial - (optional) mixed
    // Examples:
    //      fold([1, 2, 3], function(last, next) { 
    //          return last * next; 
    //      });
    //      //=> 6
    //
    function fold(list, fn, initial) {
        return _array.reduce.call(list, fn, initial);
    }

    // Selects items from the list that pass the test function.
    // Arguments:
    //      list    - array
    //      fn      - unary function
    // Examples:
    //      filter([1, 2, 3, 4, 5, 6], function(x) { 
    //          return (x % 2 === 0);
    //      });
    //      //=> [2, 4, 6]
    //
    function filter(list, fn) {
        return _array.filter.call(list, fn);
    }

    // Reverses items in a list.
    // Arguments:
    //      list    - array
    // Examples:
    //      reverse([1, 2, 3]);
    //      //=> [3, 2, 1]
    //
    function reverse(list) {
        return fold(list, function(result, item) {
            result.unshift(item);
            return result;
        }, []);
    };

    // Acts as a unary function.
    // Arguments:
    //      fn - unary function
    // Examples:
    //      var addOne = function(x) {
    //          return x + 1;
    //      };
    //      unary(addOne)(1);
    //      //=> 2
    //
    function unary(fn) {
        return function(x) {
            return fn(x);
        }
    }

    // Acts as a binary function that, if presented with only
    // one parameter will return a partial application.
    // Arguments:
    //      fn - binary function
    // Examples:
    //      var add = function(x, y) {
    //          return x + y;
    //      };
    //      binary(add)(1)(2);
    //      //=> 3
    //      binary(add)(1, 2);
    //      //=> 3
    //
    function binary(fn) {
        return function binary(x, y) {
            if (y === undefined) {
                return unary(function(x) {
                    return fn(x, y);
                });
            }
            return fn(x, y);
        }
    }

    // Acts as a ternary function that, if presented with only some
    // of the parameters will return a partial application.
    // Arguments:
    //      fn - ternary function
    // Examples:
    //      var mult = function(x, y, z) {
    //          return x * y * z;
    //      };
    //      ternary(mult)(1)(2)(3);
    //      //=> 6
    //      ternary(mult)(1, 2, 3);
    //      //=> 6
    //
    function ternary(fn) {
        return function ternary(x, y, z) {
            if (y === undefined) {
                return binary(function(y, z) {
                    return fn(x, y, z);
                });
            }
            if (z === undefined) {
                return unary(function(z) {
                    return fn(x, y, z);
                });
            }
            return fn(x, y, z);
        }
    }
	
    // Combine smaller functions into a more complex one.
    // The result of each function is passed as an argument ofthe next.
    // Arguments:
    //      fns - unary functions (many)
    // Examples:
    //      var one = function(x) {
    //          return x + 1;
    //      };
    //      var two = function(x) {
    //          return x + 2;
    //      };
    //      var three = function(x) {
    //          return x + 3;
    //      };
    //
    //      // three(two(one(x)))
    //      var combined = compose(one, two, three);
    //      combined(1);
    //      //=> 7
    //
    var compose = variadic(function(fns) {
        return function(value) {
            for (var i = fns.length-1; i >= 0; i--) {
                value = fns[i](value);
            }
            return value;
        };
    });

    root.funk = {
        variadic: variadic,
        map: map,
        fold: fold,
        filter: filter,
        reverse: reverse,
        unary: unary,
        binary: binary,
        ternary: ternary,
        compose: compose
    };
})()
