import * as Test from "firebase-functions-test";
import admin from "firebase-admin";
import * as sinon from "sinon";
import * as functions from "firebase-functions";
import * as web3Atuh from "../../src/controllers/web3/authorization";
import "mocha";
import {expect} from "chai";
const test = Test.default();
import {mockRequest} from "mock-req-res";
import {responseTemplate, writeResult} from "../utils.test";

describe("Cloud web3 Functions", () =>{
  const adminInitStub = sinon.stub(admin, "initializeApp");
  const address = "0xf47ccE462CDE1e42De44b9CA80fDC83b09452F1D";
  const addressLowercase = address.toLocaleLowerCase();
  const collectionName = "web3_addresses";
  const refPath = collectionName + "/" + addressLowercase;
  const documentSnapshot = test.firestore.makeDocumentSnapshot(
      {}, refPath);
  const firestoreStub = sinon.stub();
  const collectionStub = sinon.stub();
  const docStub = sinon.stub();
  const req = mockRequest({
    query: {
      address: address,
    },
  });

  after(()=> {
    adminInitStub.restore();
    test.cleanup();
  });

  describe("getNonce", () => {
    before(()=>{
      Object.defineProperty(admin, "firestore", {get: () => firestoreStub});
      firestoreStub.returns({collection: collectionStub,
        snapshot_: () => documentSnapshot});
      collectionStub.withArgs(collectionName).returns({doc: docStub});
      docStub.withArgs(addressLowercase).returns({
        get: () => Promise.resolve(documentSnapshot),
        update: (kv: {[key: string]: any;}) => {
          test.makeChange(
              documentSnapshot,
              test.firestore.makeDocumentSnapshot(
                  {...kv}, refPath)
          );
          return Promise.resolve(writeResult);
        },
        create: (kv: {[key: string]: any;}) => {
          test.makeChange(
              documentSnapshot,
              test.firestore.makeDocumentSnapshot(
                  {...kv}, refPath)
          );
          return Promise.resolve(writeResult);
        },
      });
    });

    let nonce: number;

    it("Fetch nonce number", (done) => {
      const res = {
        ...responseTemplate,
        status: (code: number)=>{
          responseTemplate.status(code);
          expect(code).to.equal(200);
          done();
          return res;
        },
        json: (json: string) => {
          responseTemplate.json(json);
          nonce = JSON.parse(json).nonce;
          return res;
        },
      };
      web3Atuh.getNonce(req,
         <functions.Response> res);
    });

    it("Check update firestore", (done) => {
      const firestore = admin.firestore();
      const collection = firestore.collection(collectionName);
      const doc = collection.doc(addressLowercase);
      doc.get().then( (data) =>{
        expect(data.data()?.latest_nonce).to.equal(nonce);
        done();
      });
    });
  });
});
