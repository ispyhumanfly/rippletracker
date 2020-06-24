import * as Avian from "@flypapertech/avian"
import { HttpError } from "common/http"
import { AttachmentsSchema } from "components/attachments/attachments.schema"
import { CompaniesSchema, CompaniesSchemaWithId } from "components/companies/companies.schema"
import { DailiesSchema } from "components/dailies/dailies.schema"
import { NotesSchemaWithId } from "components/dailies/notes/notes.schema"
import { WorklogsSchema } from "components/dailies/worklogs/worklogs.schema"
import { FeedbackSchema } from "components/feedback/feedback.schema"
import { ProjectsSchema, ProjectsSchemaWithId } from "components/projects/projects.schema"
import { SurveysSchema } from "components/surveys/surveys.schema"
import { UsersSchema, UsersSchemaWithId } from "components/users/users.schema"
import { RequestHandler } from "express"
import * as Session from "express-session"
import { RedisClient } from "redis"
/**
 * Express Type Definition
 *
 * @interface
 * @global
 * @public
 * @description This gives us some type completion in our component server files.
 * */
declare global {
    namespace Express {
        interface Session {
            company?: CompaniesSchemaWithId
            project?: ProjectsSchemaWithId
            user?: UsersSchemaWithId
            userId?: number
            impersonator?: boolean
        }
        interface Response {
            sendHttpError: (httpError: HttpError) => void
        }
        interface Request {
            [index: string]: any
            companies?: CompaniesSchemaWithId[]
            daily?: DailiesSchemaWithId
            notes?: NotesSchemaWithId[]
            dailyProject?: ProjectsSchema
            epilogues: RequestHandler[]
            feedback?: FeedbackSchema
            idsWithAccess?: IdsWithAccess[]
            isProtestAdmin?: boolean
            preUploadAttachments?: AttachmentsSchema[]
            project?: ProjectsSchemaWithId
            resultsFilter?: FilterFunction
            survey?: SurveysSchema
            uploadedFiles?: AttachmentsSchema[]
            users?: UsersSchemaWithId[]
            userProjects?: ProjectsSchema[]
            worklog?: WorklogsSchema
        }
    }
}

type FilterFunction = (x: any) => boolean
