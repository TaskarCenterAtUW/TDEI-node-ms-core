import { isNil } from 'lodash';
import { AbstractDomainEntityConstructor } from '../models/base/abstract-domain-entity-constructor';

/**
 * This decorator specifies a setter for the property that is decorated with it. Every
 * time the setter is called a new instance of T will be created and set to this property, unless
 * the value passed to the setter is already an instance of T
 *
 * @param T A reference to the class you want constructed when the decorated property is set
 * @param args any additional arguments you want passed to T's constructor
 * @returns {(target: any, name: string) => void}
 */
export const NestedModel = function (
  T: AbstractDomainEntityConstructor | DateConstructor | typeof Set,
  ...args: any[]
): (target: any, name: string) => void {
  return function (target: any, name: string) {
    Object.defineProperty(target, name, {
      enumerable: false,
      set: function (value) {
        Object.defineProperty(this, `_${name}`, {
          configurable: false,
          enumerable: false,
          value: isNil(value) || value instanceof T ? value : constructObject(T, value, ...args),
          writable: true,
        });
        Object.defineProperty(this, name, {
          enumerable: true,
          get: function () {
            return this[`_${name}`];
          },
          set: function (newValue) {
            this[`_${name}`] =
              isNil(newValue) || newValue instanceof T
                ? newValue
                : constructObject(T, newValue, ...args);
          },
        });
      },
    });
  };
};

export function constructObject(Obj: any, value: any, ...args: any[]): any {
  if (typeof Obj.from !== 'undefined') {
    return Obj.from(value, ...args);
  } else {
    return new Obj(value, ...args);
  }
}
