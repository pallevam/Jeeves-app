const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const expect = chai.expect
const faker = require('faker')
const { iteratee } = require('lodash')
chai.use(chaiHttp)
chai.should()

describe('User Api', () => {
    describe('login-signup api', () => {
        it('should signup the user: /signup', (done) => {
            chai.request(app)
                .post(`${process.env.BASE_PATH}/signup`)
                .send({
                    'firstName': faker.name.firstName(),
                    'lastName': faker.name.lastName(),
                    'email': faker.internet.email(),
                })
                .set('Content-Type', 'application/json')
                .end((err,res)=>{
                if(err) done(err)
                expect(res).to.have.status(201)
                expect(res.body).to.have.property('status')
                expect(res.body).to.have.property('message')
                expect(res.body.status).to.be.equal('success')
                done()
            })
        })
        it('should set the new user password: /users/forgotPassword', (done)=>{
            chai.request(app)
              .post(`${process.env.BASE_PATH}/users/forgotPassword`)
              .send({
                'email': 'vamsikrishnapalle@gmail.com',
              })
              .set('Content-Type', 'application/json')
              .end((err,res)=>{
                if(err) done(err)
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('status')
                expect(res.body).to.have.property('message')
                expect(res.body.status).to.be.equal('success')
                done()
              })
          })
      
          it('should login the user: /users/login', (done)=>{
            chai.request(app)
              .post(`${process.env.BASE_PATH}/users/login`)
              .send({
                'email': 'vamsipallekrishna1@gmail.com',
                'password': 'password123',
              })
              .set('Content-Type', 'application/json')
              .end((err,res)=>{
                if(err) done(err)
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('status')
                expect(res.body).to.have.property('message')
                expect(res.body).to.have.property('accessToken')
                expect(res.body).to.have.property('tenantId')
                expect(res.body.status).to.be.equal('success')
                done()
              })
          })
    })
})