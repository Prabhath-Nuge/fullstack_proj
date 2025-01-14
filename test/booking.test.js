import {expect, use} from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { getBookingPage } from "../backend/controllers/booking.controller.js";
import Room from "../backend/models/room.model.js";
import Service from "../backend/models/service.model.js";
import Customer from "../backend/models/customer.model.js";

use (chaiHttp);

describe("getBookingPage", () => {
    afterEach(() => {
        sinon.restore(); // Clean up stubs
    });

    it("should return 404 if no roomId is provided", async () => {
        const req = { params: {}, session: { cus: "123" } };
        const res = {
            status: sinon.stub().returnsThis(),
            render: sinon.spy(),
        };

        sinon.stub(Room, "find").resolves([{ id: 1, name: "Room 1" }]);

        await getBookingPage(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal([
            "room.ejs",
            { success: false, message: "Access Denied!!", data: [{ id: 1, name: "Room 1" }] },
        ]);
    });

    it("should return 404 if user is not logged in", async () => {
        const req = { params: { id: "roomId123" }, session: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            render: sinon.spy(),
        };

        sinon.stub(Room, "find").resolves([{ id: 1, name: "Room 1" }]);

        await getBookingPage(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal([
            "room.ejs",
            { success: false, message: "Please Log in", data: [{ id: 1, name: "Room 1" }] },
        ]);
    });

    it("should render booking.ejs with room, user, and services data", async () => {
        const req = { params: { id: "roomId123" }, session: { cus: "userId123" } };
        const res = {
            render: sinon.spy(),
        };

        sinon.stub(Room, "find").resolves([{ id: 1, name: "Room 1" }]);
        sinon.stub(Room, "findById").resolves({ id: "roomId123", name: "Room A" });
        sinon.stub(Service, "find").resolves([{ id: 1, name: "Service A" }]);

        await getBookingPage(req, res);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal([
            "booking.ejs",
            { data: { room: { id: "roomId123", name: "Room A" }, cusId: "userId123", services: [{ id: 1, name: "Service A" }] } },
        ]);
    });

  // Test case 4: Should render `index.ejs` on unexpected errors
  it("should render index.ejs on unexpected errors", async () => {
    const req = { params: { id: "room123" }, session: { cus: "user123" } };
    const res = {
      status: sinon.stub().returnsThis(),
      render: sinon.spy(),
    };

    sinon.stub(Room, "find").throws(new Error("Unexpected error"));

    await getBookingPage(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.render.calledOnce).to.be.true;
    expect(res.render.firstCall.args[0]).to.equal("index.ejs");
  });

  // Test case 7: Should render `room.ejs` if roomId is missing
  it("should render room.ejs if roomId is missing", async () => {
    const req = { params: {}, session: { cus: "user123" } };
    const res = {
      status: sinon.stub().returnsThis(),
      render: sinon.spy(),
    };

    sinon.stub(Room, "find").resolves([{ id: "room1", name: "Room A" }]);

    await getBookingPage(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.render.calledOnce).to.be.true;
    expect(res.render.firstCall.args[0]).to.equal("room.ejs");
  });

  // Test case 8: Should render room data in `room.ejs`
  it("should render room data in room.ejs", async () => {
    const req = { params: {}, session: { cus: "user123" } };
    const res = {
      status: sinon.stub().returnsThis(),
      render: sinon.spy(),
    };

    sinon.stub(Room, "find").resolves([{ id: "room1", name: "Room A" }]);

    await getBookingPage(req, res);

    expect(res.render.calledOnce).to.be.true;
    expect(res.render.firstCall.args[1].data[0]).to.have.property("name", "Room A");
  });

  // Test case 9: Should handle empty room data response
  it("should handle empty room data response", async () => {
    const req = { params: { id: "room123" }, session: { cus: "user123" } };
    const res = {
      status: sinon.stub().returnsThis(),
      render: sinon.spy(),
    };

    sinon.stub(Room, "find").resolves([]);
    sinon.stub(Service, "find").resolves([]);

    await getBookingPage(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.render.calledOnce).to.be.true;
  });
});
    
    
    
