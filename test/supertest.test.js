import supertest from "supertest";
import chai from "chai";
import mongoose from "mongoose";
import { describe, it } from "mocha";
import Product from "../src/dao/models/Product.js";
import { config } from "../src/config/config.js";

await mongoose.connect(config.MONGO_DB);

const expect = chai.expect;

const requester = supertest(`http://localhost:${config.PORT}`);

describe("Pruebas al proyeto Ecommerce", function(){
    
    this.timeout(6000);

    describe("Pruebas al módulo Productos", async function(){
        before(async function(){
            await mongoose.connection.collection("products").deleteMany({ code: "TEST000" });
        });

        it("Endpoint /api/products - POST - Crear un Producto nuevo", async function(){
            const response = await requester.post("/api/products").send({
                owner: "admin",
                title: "Test",
                description: "Test",
                price: 100,
                code: "TEST000",
                stock: 33,
                category: 1,
                status: true
            }).set("Content-Type", "application/json");
    
            expect(response.status).to.equal(200);
            expect(response.body).to.include({message: "Product created!"});
            
        });

        
        it("Endpoint /api/products - GET - Obtener Productos", async function(){
            const response = await requester.get("/api/products");
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("data").that.is.an("array");
            response.body.data.forEach((product) => {
                expect(product).to.have.property("title").that.is.a("string");
                expect(product).to.have.property("description").that.is.a("string");
                expect(product).to.have.property("price").that.is.a("number");
                expect(product).to.have.property("code").that.is.a("string");
                expect(product).to.have.property("stock").that.is.a("number");
            });
        });

    });
});