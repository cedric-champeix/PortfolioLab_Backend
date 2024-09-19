import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { PORT, REACT_URL } from './config';

////////////// AUTHENTICATION ROUTES //////////////

import { authRouter } from './api/auth';

////////////// EDITOR ROUTES //////////////

import { imageRouter } from './api/editor/image';
import { componentRouter } from './api/editor/project/component';
import { projectRouter } from './api/editor/project/project';
import { contactRouter } from './api/editor/resume/contact';
import { experienceRouter } from './api/editor/resume/experience';
import { formationRouter } from './api/editor/resume/formation';
import { hobbyRouter } from './api/editor/resume/hobby';
import { languageRouter } from './api/editor/resume/language';
import { resumeRouter } from './api/editor/resume/resume';
import { skillRouter } from './api/editor/resume/skill';

////////////// VIEWER ROUTES //////////////
import { viewerRouter } from './api/viewer/viewer';

////////////// SERVER CREATION //////////////

const app: express.Express = express();
app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

app.use(
    cors({
        origin: REACT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

////////////// ADDING ROUTES //////////////

app.use('/', authRouter);

app.use('/editor', imageRouter);
app.use('/editor', projectRouter);
app.use('/editor', componentRouter);
app.use('/editor', resumeRouter);
app.use('/editor', skillRouter);
app.use('/editor', contactRouter);
app.use('/editor', experienceRouter);
app.use('/editor', formationRouter);
app.use('/editor', languageRouter);
app.use('/editor', hobbyRouter);

app.use('/viewer', viewerRouter);

app.use('/public', express.static(path.join(__dirname, '../public')));

app.listen(PORT);
