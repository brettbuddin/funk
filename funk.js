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
    //
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
    //
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
    //
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
    //
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
    //
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

    root.funk = {
        variadic: variadic,
        map: map,
        fold: fold,
        filter: filter,
        reverse: reverse,
    };
})()
