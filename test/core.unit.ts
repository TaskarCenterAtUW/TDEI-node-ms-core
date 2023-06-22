import {Core} from "../src/core";

describe('Core unit tests',()=>{

    it('Should initialize with default configuration',()=>{
        expect(Core.initialize()).toBeTruthy();
    });

});