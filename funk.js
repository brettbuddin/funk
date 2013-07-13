(function() {
    var root  = this,
        slice = Array.prototype.slice;

    // Converts an n-ary function into a variadic function.
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
            var args = slice.call(arguments);

            if (arity === 1) {
                return fn.apply(this, [args]);
            } else {
                var applyRest  = [rest(args)],
                    applyArgs  = required(args).concat(applyRest);

                return fn.apply(this, applyArgs);
            }
        }
    }

    root.funk = {
        variadic: variadic
    };
})()
