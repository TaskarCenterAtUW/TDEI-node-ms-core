import { CoreConfig } from "../models/config";

describe('Core Configuration',() => {

    it('Should initialize Core default with Azure',()=>{
        let config = CoreConfig.default();
        expect(config.provider).toEqual("Azure");
    });
    it('Should initialize Core default based on env variable',()=>{
        process.env.PROVIDER = "Local";
        let config = CoreConfig.default();
        expect(config.provider).toEqual("Local");
    });
    it('Should load the provider based on constructor',()=>{
        let config = new CoreConfig("Docker");
        expect(config.provider).toEqual("Docker");
    });
    
});