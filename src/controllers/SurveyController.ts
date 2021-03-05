import { Request, response, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ErrorManager } from '../errors/ErrorManager';
import { SurveyRepository } from '../repositories/SurveyRepository';

class SurveyController{

    async create(request : Request, response : Response){
        const {title, description} = request.body;
        const surveyRepository = getCustomRepository(SurveyRepository);

        const exists = await surveyRepository.findOne({
            title
        })
        if(exists){
            throw new ErrorManager("Survey already exist!")
        }

        const survey = surveyRepository.create({
            title,
            description
        })
        await surveyRepository.save(survey);

        return response.status(201).json(survey);
    }

    async show(req: Request, res: Response){
        const surveyRepository = getCustomRepository(SurveyRepository);
        const all = await surveyRepository.find();
        return res.status(200).json(all);
    }
}

export { SurveyController };
