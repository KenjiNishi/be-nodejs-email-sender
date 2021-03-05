import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class NpsController{
    async execute(request: Request, response: Response){
        const {survey_id} = request.params;

        const surveyUserRepository = getCustomRepository(SurveyUserRepository);
        const surveyUsers = await surveyUserRepository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractors = surveyUsers.filter(
            (survey) => (survey.value >=0 && survey.value<=6)).length
            
        const promoters = surveyUsers.filter(
            (survey) => (survey.value >=9 && survey.value<=10)).length

        //ignore the passives that voted 7-8

        const calculate = Number(
            ((promoters - detractors) / surveyUsers.length * (100)).toFixed(2)
        );

        return response.status(200).json({
            detractors,
            promoters,
            totalAnswers : surveyUsers.length,
            nps: calculate
        })
    }
}
export {NpsController};