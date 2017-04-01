# UnserializeJs
### A small utility to help parse http query strings.

<p>This utility handles parsing http query strings and rebuilding the object from the string. The actual unserialize routine is adopted from some basic code on StackOverflow that handles the unserialization of simple strings. I've modified it and added the recursive deep parser to handle objects.</p>

<p>The routine looks for base arrays and objects, and will rebuild the nested object structure. It has been tested on a fairly complex object/array base, but I'm sure there are possible other test cases that could arise that might break it. Please create an issue if you discover that it fails on anything, and include the test case.</p>

<p>The routine does not handle type coercion or attempt to recreate the original types. The object is returned with all properties as strings. I may add type guessing and recreation (time and interest dependent).</p>

<p>This routine helped solve a basic Angular http interceptor issue I had. I could not find anything equivalent, so hopefully this will help anyone else who needs to manipulate http query strings. I do not include a re-searilization routine since searlizing is much easier.</p>