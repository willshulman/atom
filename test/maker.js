var o = require('../lib/maker').o;
var oo = require('../lib/maker').oo;
var assert = require('assert');

/*******************************************************************************
 * A
 */
function A() {
    this.name = "a";
    this.stuff = { s : 1 }
};

A.prototype.say = function() {
    return this.name;
}

/*******************************************************************************
 * B
 */
function B() {
    this.name = "a";
}

B.prototype = new A();
B.prototype.constructor = B;

/*******************************************************************************
 * C
 */
var C = oo({
    _type : B,
    stuff2 : [ { a : 1, b : 2 }, { aa : 11, bb : 22 } ]
});

/*******************************************************************************
 * D
 */
var D = oo({
    _type : C
});

/*******************************************************************************
 * dd
 */
var dd = o({
    _type : D
});

/*******************************************************************************
 * X
 */
var X = oo({
    name : "x",
    say : function() {
        return this.name;
    }
});

/*******************************************************************************
 * Y
 */
var Y = oo({
    _type : X,
    name : "y",
    stuff : { a : 1 }
});

/*******************************************************************************
 * Z
 */
var Z = oo({
    _type : Y,
    name : "z"
});

/*******************************************************************************
 * zz
 */
var zz = o({
    _type : Z,
    name : "z"
});

/*******************************************************************************
 * testInstanceOf
 */
function testInstanceOf() {
    var a = new A();
    var b = new B();
    var c = new C();
    var d = new D();

    assert.ok(a instanceof A);
    assert.ok(b instanceof B);
    assert.ok(b instanceof A);
    assert.ok(c instanceof C);
    assert.ok(d instanceof D);
    assert.ok(d instanceof C);
    assert.ok(d instanceof A);
    assert.ok(dd instanceof D);
    assert.ok(dd instanceof B);

    var x = o({ _type: X });
    var y = o({ _type: Y });
    var aa = o({ _type : A });
    assert.ok(x instanceof X);
    assert.ok(y instanceof Y);
    assert.ok(y instanceof X);
    assert.ok(aa instanceof A);
    assert.ok(zz instanceof Z);

    assert.ok(aa.__proto__.constructor === A);
    assert.ok(x.__proto__ === X.prototype);
    assert.ok(Z.prototype.constructor === Z);
}

/*******************************************************************************
 * testSideEffects
 */
function testSideEffects() {
    var a = new A();
    assert.ok(a.stuff.s === 1);
    a.stuff.s = -1;
    assert.ok(a.stuff.s === -1);
    var a2 = new A();
    assert.ok(a2.stuff.s === 1);

    var b = new B();
    assert.ok(b.stuff.s === 1);
    b.stuff.s = -1;
    assert.ok(b.stuff.s === -1);
    var b2 = new B();
//   assert.ok(b2.stuff.s === 1); // this does not work amazingly (js issue)

    var S = o({stuff : {x : 1}});
    var T = o({_type : S});
    var t1 = o({_type : T});
    assert.ok(t1.stuff.x === 1);
    t1.stuff.x = -1;
    assert.ok(t1.stuff.x === -1);
    var t2 = o({_type : T});
    assert.ok(t2.stuff.x === 1);

}

/*******************************************************************************
 * testMethodInvocation
 */
function testMethodInvocation() {
}

function run() {
    testInstanceOf();
    testSideEffects();
    testMethodInvocation();
}

// exports
exports.run = run;

// main
if (require.main == module) {
    run();
}