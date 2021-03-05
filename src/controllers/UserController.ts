import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

import * as yup from 'yup';
import { ErrorManager } from '../errors/ErrorManager';

class UserController{

    async create(request : Request, response : Response){
        const {name, email} = request.body;

        //validation
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required("Email is required and must be valid!")
        })
        try {
            await schema.validate(request.body, {abortEarly : false})
        }catch(err){
            throw new ErrorManager(err)
        }

        const userRepository = getCustomRepository(UserRepository);
        //SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        const exists = await userRepository.findOne({
            email
        })
        if(exists){
            throw new ErrorManager("User with this e-mail already exists!")
        }

        const user = userRepository.create({
            name,
            email
        })
        await userRepository.save(user);

        return response.status(201).json(user);
    }
}

export { UserController };
