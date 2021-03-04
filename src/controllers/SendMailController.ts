// handles the jointable surveys_users

import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import {resolve} from 'path';
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController{
    async execute(request: Request, response: Response){
        const {email, survey_id}= request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const userExists = await usersRepository.findOne({email});
        if(!userExists){
            return response.status(400).json({
                error:"User does not exist!"
            });
        }
        const surveyExist = await surveyRepository.findOne({id: survey_id});
        if (!surveyExist){
            return response.status(400).json({
                error:"Survey does not exist!"
            })
        }

        //surveys_users
        const surveyUser = surveyUserRepository.create({
            user_id: userExists.id,
            survey_id: surveyExist.id
        })
        await surveyUserRepository.save(surveyUser);


        //send e-mail
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const messageVar = {
            name : userExists.name,
            title: surveyExist.title,
            description: surveyExist.description,
            user_id: userExists.id,
            link: process.env.URL_MAIL
        }
        await SendMailService.execute(email, surveyExist.title, messageVar, npsPath);
        return response.status(200).json(surveyUser)
    }
}
export {SendMailController};