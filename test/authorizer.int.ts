import { Core } from "../src/core";
import { PermissionRequest } from "../src/core/auth/model/permission_request";
import { HostedAuthorizer } from "../src/core/auth/provider/hosted/hosted_authorizer";
import { SimulatedAuthorizer } from "../src/core/auth/provider/simulated/simulated_authorizer";

require('dotenv').config()

describe('Authorizer (Hosted and Simulated)', () => {

    it('Should give HostedAuthorizer for configuration', () => {
        const authorizer = Core.getAuthorizer({ provider: "Hosted" });
        expect(authorizer).toBeInstanceOf(HostedAuthorizer);
    });

    it('Should give SimulatedAuthorizer for configuration', () => {
        const authorizer = Core.getAuthorizer({ provider: "Simulated" });
        expect(authorizer).toBeInstanceOf(SimulatedAuthorizer);
    });

    it('Should pick up host url from env if not given', () => {
        const envUrl = "sample-env-url";
        process.env.AUTHURL = envUrl;
        const authorizer = Core.getAuthorizer({ provider: "Hosted" }) as HostedAuthorizer;
        // url from env
        expect(authorizer.baseUrl).toEqual(envUrl);

    });
    it('Should configure based on the url provided', () => {
        const authorizer = Core.getAuthorizer({ provider: "Hosted", apiUrl: "http://sample.com/api" }) as HostedAuthorizer;
        const envUrl = process.env.AUTHURL as string;
        expect(authorizer.baseUrl).not.toEqual(envUrl);
    });

    it('Should give error for no permissions', async () => {
        const authorizer = Core.getAuthorizer({ provider: "Hosted" });
        const permission = new PermissionRequest({
            userId: "abc",
            orgId: "sdfs",
            permssions: [],
            shouldSatisfyAll: false
        });
        await expect(authorizer?.hasPermission(permission)).rejects.toEqual("No roles provided");
    });

    it('Should give simulated result as expected (false) ', async () => {
        const authorizer = Core.getAuthorizer({ provider: "Simulated" });
        const permission = new PermissionRequest({
            userId: "000000-0000-0000-0000-000000",
            orgId: "sdfs",
            permssions: [],
            shouldSatisfyAll: false
        });
        await expect(authorizer?.hasPermission(permission)).resolves.toEqual(false);

    });

    it('Should give simulated result as expected (true)', async () => {
        const authorizer = Core.getAuthorizer({ provider: "Simulated" });
        const permission = new PermissionRequest({
            userId: "abc",
            orgId: "sdfs",
            permssions: [],
            shouldSatisfyAll: true
        });
        await expect(authorizer?.hasPermission(permission)).resolves.toEqual(true);
    });

    it('Should respond true when user has permission', async () => {

        const authorizer = Core.getAuthorizer({ provider: "Hosted", apiUrl: "https://tdei-auth-n-z-dev.azurewebsites.net/api/v1/hasPermission" });
        var permissionRequest = new PermissionRequest({
            userId: "7961d767-a352-464f-95b6-cd1c5189a93c",
            orgId: "5e339544-3b12-40a5-8acd-78c66d1fa981",
            permssions: ["poc"],
            shouldSatisfyAll: false
        });

        await expect(authorizer?.hasPermission(permissionRequest)).resolves.toEqual(true);

    });

    it('Should respond false if user does not have permission', async () => {
        const authorizer = Core.getAuthorizer({ provider: "Hosted", apiUrl: "https://tdei-auth-n-z-dev.azurewebsites.net/api/v1/hasPermission" });
        var permissionRequest = new PermissionRequest({
            userId: "sample user id",
            orgId: "5e339544-3b12-40a5-8acd-78c66d1fa981",
            permssions: ["poc"],
            shouldSatisfyAll: false
        });

        await expect(authorizer?.hasPermission(permissionRequest)).resolves.toEqual(false);
    });

    it('Should respond true if user has all the permissions required', async () => {
        const authorizer = Core.getAuthorizer({ provider: "Hosted", apiUrl: "https://tdei-auth-n-z-dev.azurewebsites.net/api/v1/hasPermission" });
        var permissionRequest = new PermissionRequest({
            userId: "sample user id",
            orgId: "5e339544-3b12-40a5-8acd-78c66d1fa981",
            permssions: ["poc"],
            shouldSatisfyAll: true
        });

        await expect(authorizer?.hasPermission(permissionRequest)).resolves.toEqual(false);

    })

    it('Should reject if the URL is malformed', async () => {
        const authorizer = Core.getAuthorizer({ provider: "Hosted", apiUrl: "<sample URL>" });
        var permissionRequest = new PermissionRequest({
            userId: "7961d767-a352-464f-95b6-cd1c5189a93c",
            orgId: "5e339544-3b12-40a5-8acd-78c66d1fa981",
            permssions: ["poc"],
            shouldSatisfyAll: false
        });

        await expect(authorizer?.hasPermission(permissionRequest)).rejects.toThrowError();
    });

});