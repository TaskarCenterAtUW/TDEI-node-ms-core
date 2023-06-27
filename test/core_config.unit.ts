import { CoreConfig } from "../src/models/config";

describe('Core Configuration', () => {

    it('Should initialize Core default with Azure', () => {
        // Act
        const config = CoreConfig.default();
        // Assert
        expect(config.provider).toEqual("Azure");
    });
    it('Should initialize Core default based on env variable', () => {
        // Arrange
        process.env.PROVIDER = "Local";
        // Act
        const config = CoreConfig.default();
        // Assert
        expect(config.provider).toEqual("Local");
    });
});