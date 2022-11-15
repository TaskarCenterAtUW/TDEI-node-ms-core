import { DeepPartial } from "..";
import { AbstractDomainEntity } from "./abstract-domain-entity";

export interface AbstractDomainEntityConstructor {
    new (json: any): AbstractDomainEntity;
    from<T>(this:  new (...args: any[]) => T ): T;
    from<T>(
      this: new (...args: any[]) => T ,
      json: DeepPartial<T> & Record<string, any>,
      ...args: any[]
    ): T;
  }
  