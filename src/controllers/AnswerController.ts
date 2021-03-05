import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { ErrorManager } from "../errors/ErrorManager";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class AnswerController{
    // eg http://localhost:8080/answers/2?u=03b4b440-46cf-4148-9ff6-de8ebf30c9f0
    async execute(request: Request, response: Response){
        const {value} = request.params;
        const {u} = request.query;

        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const surveyUser = await surveyUserRepository.findOne({
            id: String(u)
        })
        if (!surveyUser){
            throw new ErrorManager("SurveyUser does not exist!")

        }

        surveyUser.value = Number(value);
        await surveyUserRepository.save(surveyUser);
        return response.status(200).json(surveyUser);
    }
}
export {AnswerController};