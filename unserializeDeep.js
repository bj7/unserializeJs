/**
 * Deep object/array builder, that parses objects components of a query string.
 * It will build an object to its deepest property and begin creating the components.
 * An outside for-loop in necessary to pass in every input item.
 *
 * @param {Array} props             List of object properties. Each one represents one step
 *                                  deeper into the object hierarchy.
 * @param {Object} obj              The object to build back.
 * @param {string, number} input    The item to add to the array property of the object.
 * @param {boolean} isArrayType     Flag to indicate if item should be rebuilt as array, or object
 *
 * @return {Object}                 Returns the deep object array with the current input placed
 */
function buildDeepObject(props, obj, input, isArrayType) {
    isArrayType = (isArrayType === undefined ? false : isArrayType);
    if (props.length === 0 && isArrayType === true) {
        if (typeof obj === 'object' && Object.keys(obj).length <= 0) {
            obj = [];
        }
        obj.push(decodeURIComponent(input));
        return obj;
    } else if (props.length === 0) {
        return input;
    }
    var p = props[0];
    var o = obj[p] === undefined ? {} : obj[p];
    if (obj[p] === undefined) {
        obj[p] = buildDeepObject(props.slice(1), o, input, isArrayType);
    } else {
        buildDeepObject(props.slice(1), o, input, isArrayType);
    }
    return obj;
}


/**
 * Unwraps the http query string into basic objects.
 * @param {string} str The query string
 * @return {object} Returns parsed objects from the query string
 */
function unserializeFromQueryString(str) {
    // must replace any + in the query string since actual + symbols will be encoded.
    // any + in the query string is the result of POST placing it there for white space
    // GET uses %20 for spaces, but POST uses +
    str = str.replace(/\+/g, '%20');
    var chunks = decodeURI(str).split('&');
    var params = {};
    // initial outside for-loop to handle all chunks.
    for (var i = 0; i < chunks.length; i += 1) {
        var chunk = chunks[i].split('=');
        // searching for array based items
        if (chunk[0].search("\\[\\]") !== -1) {
            var prop = chunk[0].replace("[]", '');
            prop = prop.replace(/\[/g, ',');
            prop = prop.replace(/\]/g, '');
            var p = prop.split(',');
            buildDeepObject(p, params, chunk[1], true);
        // build the object properties
        } else if (chunk[0].search("\[[a-z|A-Z]*\]") !== -1) {
            var segment = chunk[0].replace(/\]/g, '');
            segment = segment.split('[');
            buildDeepObject(segment, params, chunk[1]);
        } else {
            // decode the components just to ensure no sub-strings are missed
            params[chunk[0]] = decodeURIComponent(chunk[1]);
        }
    }

    return params;
}

var out = unserializeFromQueryString(s);
