import { expect, use } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { getContactPage, getAboutPage, postContactus } from "../backend/controllers/public.controller.js";
import Contactus from "../backend/models/contactus.model.js";
import { sendEmail } from "../backend/emailService.js";

use(chaiHttp);

describe("Contact Controller Tests", () => {
    // Mock the response object
    const mockRes = () => {
        const res = {};
        res.status = sinon.stub().returns(res);
        res.render = sinon.spy();
        return res;
    };

    describe("getContactPage Function", () => {
        it("should render the contact page", () => {
            const req = {};
            const res = mockRes();

            getContactPage(req, res);
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.firstCall.args).to.deep.equal(["contact.ejs"]);
        });
    });

    describe("getAboutPage Function", () => {
        it("should render the about page", () => {
            const req = {};
            const res = mockRes();

            getAboutPage(req, res);
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.firstCall.args).to.deep.equal(["about.ejs"]);
        });
    });

    describe("postContactus Function", () => {
        afterEach(() => {
            sinon.restore(); // Clean up after each test
        });

        it("should return 400 if any field is missing", async () => {
            const req = {
                body: {
                    name: "John Doe",
                    email: "",
                    subject: "Test Subject",
                    message: "Test Message",
                },
            };
            const res = mockRes();

            await postContactus(req, res);
            expect(res.status.calledOnceWith(400)).to.be.true;
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.firstCall.args).to.deep.equal([
                "contact.ejs",
                { success: false, message: "Complete every text box before proceeding." },
            ]);
        });
    });

    describe("Contact Controller Tests", () => {
        // Mock the response object
        const mockRes = () => {
            const res = {};
            res.status = sinon.stub().returnsThis();
            res.render = sinon.spy();
            return res;
        };
    
        describe("getContactPage Function", () => {
            it("should render the contact page", () => {
                const req = {};
                const res = mockRes();
    
                getContactPage(req, res);
                expect(res.render.calledOnce).to.be.true;
                expect(res.render.firstCall.args).to.deep.equal(["contact.ejs"]);
            });
        });
    
        describe("getAboutPage Function", () => {
            it("should render the about page", () => {
                const req = {};
                const res = mockRes();
    
                getAboutPage(req, res);
                expect(res.render.calledOnce).to.be.true;
                expect(res.render.firstCall.args).to.deep.equal(["about.ejs"]);
            });
        });
    
        describe("postContactus Function", () => {
            afterEach(() => {
                sinon.restore(); // Clean up after each test
            });
    
            it("should return 400 if any field is missing", async () => {
                const req = {
                    body: {
                        name: "John Doe",
                        email: "",
                        subject: "Test Subject",
                        message: "Test Message",
                    },
                };
                const res = mockRes();
    
                await postContactus(req, res);
    
                expect(res.status.calledOnceWith(400)).to.be.true;
                expect(res.render.calledOnce).to.be.true;
                expect(res.render.firstCall.args).to.deep.equal([
                    "contact.ejs",
                    { success: false, message: "Complete every text box before proceeding." },
                ]);
            });
        });
    });

    describe("Contact Controller Tests", () => {
        // Mock the response object
        const mockRes = () => {
            const res = {};
            res.status = sinon.stub().returnsThis();
            res.render = sinon.spy();
            return res;
        };
    
        describe("getContactPage Function", () => {
            it("should render the contact page", () => {
                const req = {};
                const res = mockRes();
    
                getContactPage(req, res);
    
                expect(res.render.calledOnce).to.be.true;
                expect(res.render.firstCall.args).to.deep.equal(["contact.ejs"]);
            });
        });
    
        describe("getAboutPage Function", () => {
            it("should render the about page", () => {
                const req = {};
                const res = mockRes();
    
                getAboutPage(req, res);
    
                expect(res.render.calledOnce).to.be.true;
                expect(res.render.firstCall.args).to.deep.equal(["about.ejs"]);
            });
        });
    
        describe("postContactus Function", () => {
            afterEach(() => {
                sinon.restore(); // Clean up Sinon stubs after each test
            });
    
            it("should return 400 if any field is missing", async () => {
                const req = {
                    body: {
                        name: "John Doe",
                        email: "",
                        subject: "Test Subject",
                        message: "Test Message",
                    },
                };
                const res = mockRes();
    
                await postContactus(req, res);
    
                expect(res.status.calledOnceWith(400)).to.be.true;
                expect(res.render.calledOnce).to.be.true;
                expect(res.render.firstCall.args).to.deep.equal([
                    "contact.ejs",
                    { success: false, message: "Complete every text box before proceeding." },
                ]);
            });
        });
    });

    describe("Contact Controller Additional Tests", () => {
    afterEach(() => {
        sinon.restore(); // Clean up Sinon stubs after each test
    });

    describe("getContactPage Function", () => {
        it("should not call res.status or res.send", () => {
            const req = {};
            const res = {
                status: sinon.spy(),
                send: sinon.spy(),
                render: sinon.spy(),
            };

            getContactPage(req, res);

            expect(res.render.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
            expect(res.send.called).to.be.false;
        });
    });

    describe("getAboutPage Function", () => {
        it("should not modify the request object", () => {
            const req = { test: "dummy" };
            const res = {
                render: sinon.spy(),
            };

            getAboutPage(req, res);

            expect(req).to.deep.equal({ test: "dummy" }); // Ensure `req` remains unchanged
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.firstCall.args).to.deep.equal(["about.ejs"]);
        });
    });
});
describe("Contact Controller Additional Tests", () => {
    afterEach(() => {
        sinon.restore(); // Clean up Sinon stubs after each test
    });

    describe("getContactPage Function", () => {
        it("should not call res.status or res.send", () => {
            const req = {};
            const res = {
                status: sinon.spy(),
                send: sinon.spy(),
                render: sinon.spy(),
            };

            getContactPage(req, res);

            expect(res.render.calledOnce).to.be.true;
            expect(res.status.called).to.be.false;
            expect(res.send.called).to.be.false;
        });
    });

    describe("getAboutPage Function", () => {
        it("should not modify the request object", () => {
            const req = { test: "dummy" };
            const res = {
                render: sinon.spy(),
            };

            getAboutPage(req, res);

            expect(req).to.deep.equal({ test: "dummy" }); // Ensure `req` remains unchanged
            expect(res.render.calledOnce).to.be.true;
            expect(res.render.firstCall.args).to.deep.equal(["about.ejs"]);
        });
    });
    });
});
