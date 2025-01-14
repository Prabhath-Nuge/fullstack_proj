import { expect, use } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import {
    getRooms,
    addRoom,
    deleteRoom,
    updateRoom,
    getOneRoom,
} from "../backend/controllers/room.controller.js";
import Room from "../backend/models/room.model.js";

use(chaiHttp);

describe("Room Controller Tests", () => {
    afterEach(() => {
        sinon.restore(); // Restore Sinon mocks after each test
    });

    describe("getRooms Function", () => {
        it("should render room.ejs with empty room data if no rooms are found", async () => {
            const req = {};
            const res = {
                render: sinon.spy(),
            };

            sinon.stub(Room, "find").resolves([]);

            await getRooms(req, res);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.firstCall.args).to.deep.equal([
                "room.ejs",
                { data: [] },
            ]);
        });
    });

    describe("addRoom Function", () => {
        it("should return 400 if roomType already exists", async () => {
            const req = {
                body: { roomType: "Deluxe", bedType: "King", price: 200, status: "Available" },
            };
            const res = {
                send: sinon.spy(),
            };

            sinon.stub(Room, "find").resolves([{ roomType: "Deluxe" }]);

            await addRoom(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args).to.deep.equal([
                { success: false, message: "That room Type Allready Exists" },
            ]);
        });
    });

    describe("deleteRoom Function", () => {
        it("should return 404 if the room does not exist", async () => {
            const req = { params: { id: "nonexistentRoomId" } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.spy(),
            };

            sinon.stub(Room, "findByIdAndDelete").resolves(null);

            await deleteRoom(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args).to.deep.equal([
                { success: false, message: "Room not found" },
            ]);
        });

        it("should return 500 if an error occurs during deletion", async () => {
            const req = { params: { id: "roomId123" } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.spy(),
            };

            sinon.stub(Room, "findByIdAndDelete").throws(new Error("Delete failed"));

            await deleteRoom(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args).to.deep.equal([
                { message: "Internal server error" },
            ]);
        });
    });

    describe("updateRoom Function", () => {
        it("should return 404 if room is not found", async () => {
            const req = {
                body: { roomId: "nonexistentRoomId", roomType: "Suite", bedType: "Queen", price: 300, status: "Available" },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy(),
            };

            sinon.stub(Room, "findById").resolves(null);

            await updateRoom(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args).to.deep.equal([
                { success: false, message: "Room not found" },
            ]);
        });
    });

    describe("getOneRoom Function", () => {
        it("should return 404 if room is not found", async () => {
            const req = { params: { id: "nonexistentRoomId" } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.spy(),
            };

            sinon.stub(Room, "findById").resolves(null);

            await getOneRoom(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args).to.deep.equal([
                { success: false, message: "Room not found" },
            ]);
        });
    });
});

describe("getRooms Function", () => {
    it("should render room.ejs with room data", async () => {
        const req = {};
        const res = {
            render: sinon.spy(),
        };

        const mockRooms = [
            { id: "1", roomType: "Deluxe", bedType: "King", price: 200, status: "Available" },
            { id: "2", roomType: "Standard", bedType: "Queen", price: 150, status: "Unavailable" },
        ];
        sinon.stub(Room, "find").resolves(mockRooms);

        await getRooms(req, res);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.firstCall.args).to.deep.equal([
            "room.ejs",
            { data: mockRooms },
        ]);
    });
});

describe("addRoom Function", () => {
    it("should return 400 if required fields are missing", async () => {
        const req = {
            body: { roomType: "", bedType: "", price: "", status: "" },
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
        };

        await addRoom(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args).to.deep.equal([
            { error: "All fields are required" },
        ]);
    });
});

describe("getOneRoom Function", () => {

    it("should return 200 if room is found", async () => {
        const req = { params: { id: "roomId123" } };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy(),
        };

        const mockRoom = { id: "roomId123", roomType: "Deluxe", price: 200 };
        sinon.stub(Room, "findById").resolves(mockRoom);

        await getOneRoom(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args).to.deep.equal([
            { success: true, message: "Room available", room: mockRoom },
        ]);
    });
});

