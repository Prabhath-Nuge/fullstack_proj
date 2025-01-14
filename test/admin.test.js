import {expect, use} from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { loadAdminPage, adminGetUsers } from "../backend/controllers/admin.controller.js";
import Customer from "../backend/models/customer.model.js";

use(chaiHttp);

describe("loadAdminPage Function", () => {
    it("should render index.ejs with login message if user is not logged in", () => {
        const req = { session: { cus: null } };
        const res = {
            render: sinon.spy(),
        };

        loadAdminPage(req, res);
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal([
            "index.ejs",
            { success: false, message: "You must log in first" },
        ]);
    });

    it("should render index.ejs with login message if user is not an admin", () => {
        const req = { session: { cus: { type: "customer" } } };
        const res = {
            render: sinon.spy(),
        };

        loadAdminPage(req, res);
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal([
            "index.ejs",
            { success: false, message: "You must log in first" },
        ]);
    });

    it("should render adminIndex.ejs if user is an admin", () => {
        const req = { session: { cus: { type: "admin" } } };
        const res = {
            render: sinon.spy(),
        };

        loadAdminPage(req, res);
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal(["adminIndex.ejs"]);
    });
});

describe("adminGetUsers Function", () => {
    afterEach(() => {
        sinon.restore(); // Cleanup after each test
    });

    it("should render index.ejs with login message if user is not logged in", async () => {
        const req = { session: { cus: null } };
        const res = {
            render: sinon.spy(),
        };

        await adminGetUsers(req, res);
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal([
            "index.ejs",
            { success: false, message: "You must log in first" },
        ]);
    });

    it("should render index.ejs with login message if user is not an admin", async () => {
        const req = { session: { cus: { type: "customer" } } };
        const res = {
            render: sinon.spy(),
        };

        await adminGetUsers(req, res);
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal([
            "index.ejs",
            { success: false, message: "You must log in first" },
        ]);
    });

    it("should render admingetusers.ejs with customer data if user is an admin", async () => {
        const customers = [
            { name: "John Doe", email: "john@example.com" },
            { name: "Jane Smith", email: "jane@example.com" },
        ];

        sinon.stub(Customer, "find").resolves(customers);

        const req = { session: { cus: { type: "admin" } } };
        const res = {
            render: sinon.spy(),
        };

        await adminGetUsers(req, res);
        expect(Customer.find.calledOnce).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal([
            "admingetusers.ejs",
            { data: customers },
        ]);
    });
    it("should not call res.render more than once when user is admin", () => {
    const req = { session: { cus: { type: "admin" } } };
    const res = {
        render: sinon.spy(),
    };

    loadAdminPage(req, res);

    expect(res.render.calledOnce).to.be.true;
});

it("should not call res.render more than once when user is an admin", async () => {
    const req = { session: { cus: { type: "admin" } } };
    const res = {
        render: sinon.spy(),
    };

    const mockCustomers = [{ name: "John Doe" }, { name: "Jane Doe" }];
    sinon.stub(Customer, "find").resolves(mockCustomers);

    await adminGetUsers(req, res);

    expect(res.render.calledOnce).to.be.true;
    Customer.find.restore();
});
it("should call Customer.find with the correct filter to fetch customers", async () => {
    const req = { session: { cus: { type: "admin" } } };
    const res = {
        render: sinon.spy(),
    };

    const findStub = sinon.stub(Customer, "find").resolves([]);

    await adminGetUsers(req, res);

    expect(findStub.calledOnceWith({ type: "customer" })).to.be.true;

    Customer.find.restore();
});

it("should not proceed to render users if user is not an admin", async () => {
    const req = { session: { cus: { type: "customer" } } };
    const res = {
        render: sinon.spy(),
    };

    await adminGetUsers(req, res);

    expect(res.render.calledOnce).to.be.true;
    expect(res.render.firstCall.args).to.deep.equal([
        "index.ejs",
        { success: false, message: "You must log in first" },
    ]);
});

it("should render index.ejs if user type is 'Admin' (case-sensitive check)", () => {
    const req = { session: { cus: { type: "Admin" } } }; // "Admin" with capital 'A'
    const res = {
        render: sinon.spy(),
    };

    loadAdminPage(req, res);

    expect(res.render.calledOnce).to.be.true;
    expect(res.render.firstCall.args).to.deep.equal([
        "index.ejs",
        { success: false, message: "You must log in first" },
    ]);
});

it("should render adminIndex.ejs if req.session.cus contains extra properties", () => {
    const req = { session: { cus: { type: "admin", extraProp: "unexpected" } } };
    const res = {
        render: sinon.spy(),
    };

    loadAdminPage(req, res);

    expect(res.render.calledOnce).to.be.true;
    expect(res.render.firstCall.args).to.deep.equal(["adminIndex.ejs"]);
});

it("should render admingetusers.ejs with an empty data array if no customers are found", async () => {
    sinon.stub(Customer, "find").resolves([]); // Mock find to return an empty array

    const req = { session: { cus: { type: "admin" } } };
    const res = {
        render: sinon.spy(),
    };

    await adminGetUsers(req, res);

    expect(res.render.calledOnce).to.be.true;
    expect(res.render.firstCall.args).to.deep.equal([
        "admingetusers.ejs",
        { data: [] },
    ]);

    Customer.find.restore();
});

it("should not call Customer.find if user is not logged in or not an admin", async () => {
    const findStub = sinon.stub(Customer, "find"); // Stub find but do not let it resolve

    const req1 = { session: {} }; // No user logged in
    const res1 = { render: sinon.spy() };
    await adminGetUsers(req1, res1);
    expect(findStub.called).to.be.false;

    const req2 = { session: { cus: { type: "customer" } } }; // Not an admin
    const res2 = { render: sinon.spy() };
    await adminGetUsers(req2, res2);
    expect(findStub.called).to.be.false;

    Customer.find.restore();
});

it("should render index.ejs if req.session.cus.type is invalid", async () => {
    const req = { session: { cus: { type: "randomType" } } }; // Invalid type
    const res = { render: sinon.spy() };

    await adminGetUsers(req, res);

    expect(res.render.calledOnce).to.be.true;
    expect(res.render.firstCall.args).to.deep.equal([
        "index.ejs",
        { success: false, message: "You must log in first" },
    ]);
});

});
