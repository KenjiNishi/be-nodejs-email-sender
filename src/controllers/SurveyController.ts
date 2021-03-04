import { Request, response, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyRepository } from '../repositories/SurveyRepository';

class SurveyController{

    async create(request : Request, response : Response){
        const {title, description} = request.body;
        const surveyRepository = getCustomRepository(SurveyRepository);

        const exists = await surveyRepository.findOne({
            title
        })
        if(exists){
            return response.status(400).json({
                error:"Survey already exists!"
            })
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

        if(all.length>0){
            return res.status(200).json(all);
        }
        else{
            return res.status(400).json({
                error:"Empty!!!"
            })
        }
    }
}

export { SurveyController };
