const expect = require('chai').expect;
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const user_controller = require('../../controllers/users-controller');


chai.should();
chai.use(sinonChai);


beforeEach(() => {

});


describe('User controller tests', () => {
    context('getAllUsers', () => {
        it('should check for users', () => {
            expect(user_controller.getAllUsers()).to.not.equal(0 || null || undefined);
        });
        xit('should return an object containing a users array', () => {
            expect(user_controller.getAllUsers()).to.be.a({users: 'object'});
        });
    });
    context('getUserById', () => {
        it('', () => {
            
        });
    });
});