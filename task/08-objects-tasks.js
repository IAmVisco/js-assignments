'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Перед началом работы с заданием, пожалуйста ознакомьтесь с туториалом:                         *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Возвращает объект Прямоугольник (rectangle) с параметрами высота (height) и ширина (width)
 * и методом getArea(), который возвращает площадь
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    Rectangle.prototype.getArea =  function() {
        return this.width * this.height;
    }
}


/**
 * Возвращает JSON представление объекта
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Возвращает объект указанного типа из представления JSON
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    let jsonObj = JSON.parse(json);
    let obj = Object.create(proto);
    for (let field in proto.prototype)
        obj[field] = proto[field];
    for (let field in jsonObj)
        obj[field] = jsonObj[field]
    return Object.setPrototypeOf(jsonObj, proto);
}


/**
 * Создатель css селекторов
 *
 * Каждый комплексый селектор может состоять из эелемента, id, класса, атрибута, псевдо-класса и
 * псевдо-элемента
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Может быть несколько вхождений
 *
 * Любые варианты селекторов могут быть скомбинированы с помощью ' ','+','~','>' .
 *
 * Задача состоит в том, чтобы создать отдельный класс, независимые классы или
 * иерархию классов и реализовать функциональность
 * для создания селекторов css с использованием предоставленного cssSelectorBuilder.
 * Каждый селектор должен иметь метод stringify ()
 * для вывода строкового представления в соответствии с спецификацией css.
 *
 * Созданный cssSelectorBuilder должен использоваться как фасад
 * только для создания ваших собственных классов,
 * например, первый метод cssSelectorBuilder может быть таким:
 *
 * Дизайн класса(ов) полностью зависит от вас,
 * но постарайтесь сделать его максимально простым, понятным и читаемым насколько это возможно.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  Если нужно больше примеров - можете посмотреть юнит тесты.
 */

const CssSelector = (function () {
    const extraPartsErrorMsg = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    const invalidOrderErrorMsg = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    const map = new WeakMap();

    const State = Object.freeze({
        ELEMENT: 0,
        ID: 1,
        CLASS: 2,
        ATTR: 3,
        PSEUDO_CLASS: 4,
        PSEUDO_ELEMENT: 5,
        COMBINED_SELECTOR: 10
    });

    function internal(ref) {
        if (!map.get(ref)) {
            map.set(ref, {});
        }
        return map.get(ref);
    }

    function addPart(scope, value, validState, nextState) {
        const selector = internal(scope);
        if (selector.alreadyCalled[validState]) {
            throw new Error(extraPartsErrorMsg);
        }
        if (selector.currentState > validState) {
            throw new Error(invalidOrderErrorMsg);
        }
        if (nextState) {
            selector.alreadyCalled[validState] = true;
        }
        scope.selector += value;
        selector.currentState = nextState || validState;
        return scope;
    }

    function CssSelector(selector, state) {
        this.selector = selector || '';
        internal(this).currentState = state || State.ELEMENT;
        internal(this).alreadyCalled = {};
    }

    CssSelector.prototype = {

        element: function (value) {
            return addPart(this, value, State.ELEMENT, State.ID);
        },

        id: function (value) {
            return addPart(this, `#${value}`, State.ID, State.CLASS);
        },

        class: function (value) {
            return addPart(this, `.${value}`, State.CLASS);
        },

        attr: function (value) {
            return addPart(this, `[${value}]`, State.ATTR);
        },

        pseudoClass: function (value) {
            return addPart(this, `:${value}`, State.PSEUDO_CLASS);
        },

        pseudoElement: function (value) {
            return addPart(this, `::${value}`, State.PSEUDO_ELEMENT, State.COMBINED_SELECTOR);
        },

        combine: function (second, combinator) {
            const combinedSelector = `${this.selector} ${combinator} ${second.selector}`;
            return new CssSelector(combinedSelector, State.COMBINED_SELECTOR);
        },

        stringify: function () {
            return this.selector;
        }
    };

    return CssSelector;

}());

const cssSelectorBuilder = {

    element: function (value) {
        return new CssSelector().element(value);
    },

    id: function (value) {
        return new CssSelector().id(value);
    },

    class: function (value) {
        return new CssSelector().class(value);
    },

    attr: function (value) {
        return new CssSelector().attr(value);
    },

    pseudoClass: function (value) {
        return new CssSelector().pseudoClass(value);
    },

    pseudoElement: function (value) {
        return new CssSelector().pseudoElement(value);
    },

    combine: function (selector1, combinator, selector2) {
        return selector1.combine(selector2, combinator);
    },
};

module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
