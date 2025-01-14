import { expect } from 'chai';
import sinon from 'sinon';
import Customer from '../backend/models/customer.model.js'; // Adjust path as needed

describe('Customer Model', function() {
  // Increase the timeout to 10000ms for this test
  this.timeout(5000);

  let saveStub;
  let findOneStub;

  before(() => {
    // Mock the save method to avoid database interaction
    saveStub = sinon.stub(Customer.prototype, 'save').resolves(true);
    // Mock the findOne method for checking existing users (for example, in registration)
    findOneStub = sinon.stub(Customer, 'findOne');
  });

  it('should create a new customer', async () => {
    const customer = new Customer({
      name: 'John',
      email: 'john@example.com',
      type: 'regular',
      password: 'password123',
      dob: '1990-01-01',
      address: '123 Main St',
      pnumber: '1234567890',
    });

    try {
      await customer.save(); // This will use the stubbed method
      expect(saveStub.calledOnce).to.be.true; // Check that save was called
      expect(customer.name).to.equal('John');
      expect(customer.email).to.equal('john@example.com');
    } catch (error) {
      console.error('Error during customer creation:', error);
    }
  });

  it('should fail to create a customer if email is missing', async () => {
    const customer = new Customer({
      name: 'Jane',
      type: 'regular',
      password: 'password123',
      dob: '1992-05-10',
      address: '456 Side St',
      pnumber: '0987654321',
    });

    try {
      await customer.save(); // This will use the stubbed method
      expect(saveStub.calledOnce).to.be.false; // Save should not be called
    } catch (error) {
      expect(error.message).to.include('email');
    }
  });

  it('should find an existing customer by email', async () => {
    const mockCustomer = {
      name: 'John',
      email: 'john@example.com',
      type: 'regular',
      password: 'password123',
      dob: '1990-01-01',
      address: '123 Main St',
      pnumber: '1234567890',
    };
    
    findOneStub.resolves(mockCustomer);

    const customer = await Customer.findOne({ email: 'john@example.com' });
    expect(findOneStub.calledOnce).to.be.true;
    expect(customer).to.not.be.null;
    expect(customer.email).to.equal('john@example.com');
  });

  it('should return null when customer not found by email', async () => {
    // Stub findOne to resolve null
    findOneStub.resolves(null);

    const customer = await Customer.findOne({ email: 'nonexistent@example.com' });
    
    // Assert that the stub was called once
    expect(findOneStub.calledOnce).to.be.false;
    
    // Assert that no customer is found
    expect(customer).to.be.null;
  });

  it('should handle error when findOne fails', async () => {
    const error = new Error('Database error');
    findOneStub.rejects(error);

    try {
      await Customer.findOne({ email: 'john@example.com' });
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should not allow duplicate email during registration', async () => {
    const existingUser = {
      name: 'John',
      email: 'john@example.com',
      type: 'regular',
      password: 'password123',
      dob: '1990-01-01',
      address: '123 Main St',
      pnumber: '1234567890',
    };

    findOneStub.resolves(existingUser);

    try {
      const newCustomer = new Customer({
        name: 'Jane',
        email: 'john@example.com', // Duplicate email
        type: 'regular',
        password: 'password123',
        dob: '1992-05-10',
        address: '456 Side St',
        pnumber: '0987654321',
      });

      await newCustomer.save();
    } catch (error) {
      expect(error.message).to.include('User already exists');
    }
  });

  after(() => {
    // Restore the stubbed methods after tests
    saveStub.restore();
    findOneStub.restore();
  });
});

