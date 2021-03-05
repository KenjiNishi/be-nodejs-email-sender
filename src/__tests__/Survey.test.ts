import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database';

describe("Surveys",()=>{
    beforeAll(async ()=>{
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async ()=>{
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })

    it("Should be able to create a new survey", async ()=>{
        const response = await request(app).post("/surveys").send({
            title: "Test Survey",
            description: "Interesting description",
        });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        }) 
    
    
    it("Should not be able to create a new survey with existing title", async ()=>{
        const response = await request(app).post("/surveys").send({
            title: "Test Survey",
            description: "Different, not as cool",
        });
        
        expect(response.status).toBe(400);
        }) 

    it("Should be able to get all surveys", async ()=>{
        await request(app).post("/surveys").send({
            title: "Anotha one",
            description: "D e s c r i p t i o n",
        });

        const response = await request(app).get("/surveys")
        
        expect(response.body.length).toBe(2);
        expect(response.status).toBe(200);
        }) 
    
    
});