import { expect, use } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { addService } from "../backend/controllers/service.controller.js";
import Service from "../backend/models/service.model.js";

use(chaiHttp);

describe("addService Function", () => {
    afterEach(() => {
        sinon.restore(); // Restore original methods after each test
    });

    // Test case 1: Should return 406 if name or price is missing
    it("should return 406 if name or price is missing", async () => {
        const req = { body: { name: "", price: null, image: "" } };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        await addService(req, res);

        expect(res.status.calledWith(406)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args).to.deep.equal([
            {
                success: false,
                message: "Doesn't find any content that conforms to the criteria given by the user agent",
            },
        ]);
    });

    // Test case 2: Should return 200 and mock save without database
    it("should return 200 and mock save without database", async () => {
        const req = {
            body: { name: "Test Service", price: 100, image: "test.jpg" },
        };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        const mockService = new Service(req.body);
        sinon.stub(Service.prototype, "save").resolves(mockService);

        await addService(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.deep.include({
            success: true,
            message: "Service added successfully!",
        });
    });

    // Test case 3: Should return 502 on error
    it("should return 502 on error", async () => {
        const req = { body: { name: "Test Service", price: 100, image: "test.jpg" } };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        sinon.stub(Service.prototype, "save").rejects(new Error("Database error"));

        await addService(req, res);

        expect(res.status.calledWith(502)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.deep.include({
            success: false,
            message: "Error occured Database error",
        });
    });


    // Test case 5: Should return 406 if name is missing
    it("should return 406 if name is missing", async () => {
        const req = { body: { name: "", price: 100, image: "test.jpg" } };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        await addService(req, res);

        expect(res.status.calledWith(406)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.deep.equal({
            success: false,
            message: "Doesn't find any content that conforms to the criteria given by the user agent",
        });
    });


    // Test case 8: Should return 200 for valid service creation with valid inputs
    it("should return 200 for valid service creation", async () => {
        const req = { body: { name: "Valid Service", price: 250, image: "valid.jpg" } };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        const mockService = new Service(req.body);
        sinon.stub(Service.prototype, "save").resolves(mockService);

        await addService(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.deep.include({
            success: true,
            message: "Service added successfully!",
        });
    });

    // Test case 9: Should return 404 if database error occurs during save
    it("should return 404 if database error occurs during save", async () => {
        const req = { body: { name: "Error Service", price: 200, image: "error.jpg" } };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        sinon.stub(Service.prototype, "save").rejects(new Error("Database error"));

        await addService(req, res);

        expect(res.status.calledWith(502)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.deep.include({
            success: false,
            message: "Error occured Database error",
        });
    });

    // Test case 10: Should return 406 if price is not provided
    it("should return 406 if price is not provided", async () => {
        const req = { body: { name: "Missing Price Service", price: undefined, image: "missing_price.jpg" } };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        await addService(req, res);

        expect(res.status.calledWith(406)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.deep.equal({
            success: false,
            message: "Doesn't find any content that conforms to the criteria given by the user agent",
        });
    });

    // Test case 11: Should handle multiple valid service creations
    it("should handle multiple valid service creations", async () => {
        const req1 = { body: { name: "Service 1", price: 150, image: "service1.jpg" } };
        const req2 = { body: { name: "Service 2", price: 200, image: "service2.jpg" } };

        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        const mockService1 = new Service(req1.body);
        const mockService2 = new Service(req2.body);
        sinon.stub(Service.prototype, "save").onFirstCall().resolves(mockService1).onSecondCall().resolves(mockService2);

        await addService(req1, res);
        await addService(req2, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.send.calledTwice).to.be.true;
        expect(res.send.firstCall.args[0]).to.deep.include({
            success: true,
            message: "Service added successfully!",
        });
    });

    // Test case 12: Should handle empty body with no name and price
    it("should return 406 for empty body with no name or price", async () => {
        const req = { body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        await addService(req, res);

        expect(res.status.calledWith(406)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.deep.equal({
            success: false,
            message: "Doesn't find any content that conforms to the criteria given by the user agent",
        });
    });


    // Test case 14: Should return 406 if price is zero
    it("should return 406 if price is zero", async () => {
        const req = { body: { name: "Zero Price Service", price: 0, image: "zeroprice.jpg" } };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        await addService(req, res);

        expect(res.status.calledWith(406)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.deep.equal({
            success: false,
            message: "Doesn't find any content that conforms to the criteria given by the user agent",
        });
    });

// Test case: Should return 406 if price is not provided but other fields are valid
it("should return 406 if price is not provided but other fields are valid", async () => {
    const req = { body: { name: "Valid Name", price: undefined, image: "image.jpg" } };
    const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy(),
    };

    await addService(req, res);

    expect(res.status.calledWith(406)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
    expect(res.send.firstCall.args[0]).to.deep.equal({
        success: false,
        message: "Doesn't find any content that conforms to the criteria given by the user agent",
    });
});

// Test case: Should return 406 if all fields are undefined
it("should return 406 if all fields are undefined", async () => {
    const req = { body: { name: undefined, price: undefined, image: undefined } };
    const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy(),
    };

    await addService(req, res);

    expect(res.status.calledWith(406)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
    expect(res.send.firstCall.args[0]).to.deep.equal({
        success: false,
        message: "Doesn't find any content that conforms to the criteria given by the user agent",
    });
});

});